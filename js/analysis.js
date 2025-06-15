// js/analysis.js
let pitchModel, mic, audioContext;
let isRecording = false;
let results = [];

async function initPitch() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const source = audioContext.createMediaStreamSource(stream);
  const modelUrl = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';
  pitchModel = await ml5.pitchDetection(modelUrl, audioContext, source.stream, () => console.log('Pitch model loaded'));
}

document.getElementById('startRec').onclick = async () => {
  if (!pitchModel) await initPitch();
  isRecording = true;
  results = [];
  document.getElementById('startRec').disabled = true;
  document.getElementById('stopRec').disabled  = false;
  recordPitch();
};

document.getElementById('stopRec').onclick = () => {
  isRecording = false;
  document.getElementById('stopRec').disabled = true;
};

function recordPitch() {
  if (!isRecording) return showResults();
  pitchModel.getPitch((err, frequency) => {
    if (frequency) results.push(frequency);
    setTimeout(recordPitch, 200);
  });
}

function showResults() {
  const ul = document.getElementById('analysisList');
  ul.innerHTML = '';
  const avg = results.reduce((a, b) => a + b, 0) / results.length;
  results.forEach((f, i) => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.textContent = `Зразок ${i+1}: ${f.toFixed(2)} Hz (${frequencyToNote(f)})`;
    ul.appendChild(li);
  });
  const liAvg = document.createElement('li');
  liAvg.className = 'list-group-item fw-bold';
  liAvg.textContent = `Середній тон: ${avg.toFixed(2)} Hz (${frequencyToNote(avg)})`;
  ul.appendChild(liAvg);

  // Recommendations
  const liRec = document.createElement('li');
  liRec.className = 'list-group-item text-primary';
  liRec.textContent = 'Рекомендації: ' + getRecommendations(results);
  ul.appendChild(liRec);

  document.getElementById('analysisResult').classList.remove('d-none');
}

function frequencyToNote(frequency) {
  if (!frequency) return '';
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const A4 = 440;
  const n = Math.round(12 * Math.log2(frequency / A4));
  const noteIndex = (n + 9) % 12;
  const octave = 4 + Math.floor((n + 9) / 12);
  return noteNames[(noteIndex + 12) % 12] + octave;
}

function getRecommendations(frequencies) {
  if (frequencies.length === 0) return 'Недостатньо даних для аналізу.';
  const avg = frequencies.reduce((a, b) => a + b, 0) / frequencies.length;
  const variance = frequencies.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / frequencies.length;
  const stdDev = Math.sqrt(variance);

  let recs = [];
  if (stdDev > 5) {
    recs.push('Спробуйте тримати тон стабільніше, уникайте коливань висоти.');
  } else {
    recs.push('Ваша стабільність тону хороша!');
  }

  // Range analysis
  const min = Math.min(...frequencies);
  const max = Math.max(...frequencies);
  if (max - min > 50) {
    recs.push('Ваша гра охоплює широкий діапазон нот. Це добре для розвитку техніки!');
  } else {
    recs.push('Спробуйте грати ширший діапазон нот для кращого розвитку.');
  }

  // Tempo estimation (simple: based on number of notes per time)
  const durationSec = frequencies.length * 0.2; // 200ms per sample
  const notesPerSec = frequencies.length / durationSec;
  if (notesPerSec < 2) {
    recs.push('Грайте трохи швидше для розвитку ритму.');
  } else if (notesPerSec > 6) {
    recs.push('Грайте повільніше для кращої точності.');
  } else {
    recs.push('Ваш темп гри оптимальний!');
  }

  // Note recognition
  const notes = frequencies.map(frequencyToNote);
  const uniqueNotes = [...new Set(notes)];
  recs.push('Ви зіграли такі ноти: ' + uniqueNotes.join(', '));

  return recs.join(' ');
}