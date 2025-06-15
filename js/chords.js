// js/chords.js
let pitchModel, audioContext, isRecording = false, results = [];

async function initPitch() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const modelUrl = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';
  pitchModel = await ml5.pitchDetection(modelUrl, audioContext, stream, () => console.log('Pitch model loaded'));
}

document.getElementById('startChord').onclick = async () => {
  if (!pitchModel) await initPitch();
  isRecording = true;
  results = [];
  document.getElementById('startChord').disabled = true;
  document.getElementById('stopChord').disabled  = false;
  recordPitch();
};

document.getElementById('stopChord').onclick = () => {
  isRecording = false;
  document.getElementById('stopChord').disabled = true;
  showResults();
};

function recordPitch() {
  if (!isRecording) return showResults();
  pitchModel.getPitch((err, frequency) => {
    if (frequency) results.push(frequency);
    setTimeout(recordPitch, 200);
  });
}

function showResults() {
  const ul = document.getElementById('chordList');
  ul.innerHTML = '';
  if (results.length === 0) {
    const li = document.createElement('li');
    li.className = 'list-group-item text-danger';
    li.textContent = 'Не вдалося розпізнати жодного акорду. Спробуйте ще раз!';
    ul.appendChild(li);
    document.getElementById('chordResult').classList.remove('d-none');
    return;
  }

  // Convert frequencies to note names
  const notes = results.map(frequencyToNote);
  const uniqueNotes = [...new Set(notes)];

  // Guess chord name
  const chordName = guessChordName(uniqueNotes);
  const liChord = document.createElement('li');
  liChord.className = 'list-group-item fw-bold';
  liChord.textContent = 'Розпізнаний акорд: ' + chordName;
  ul.appendChild(liChord);

  document.getElementById('chordResult').classList.remove('d-none');
}

function frequencyToNote(frequency) {
  if (!frequency) return '';
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const A4 = 440;
  const n = Math.round(12 * Math.log2(frequency / A4));
  const noteIndex = (n + 9) % 12;
  return noteNames[(noteIndex + 12) % 12];
}

function guessChordName(notes) {
  // Improved chord guessing logic
  if (notes.includes('C') && notes.includes('E') && notes.includes('G')) return 'C мажор';
  if (notes.includes('A') && notes.includes('C#') && notes.includes('E')) return 'A мажор';
  if (notes.includes('D') && notes.includes('F#') && notes.includes('A')) return 'D мажор';
  if (notes.includes('G') && notes.includes('B') && notes.includes('D')) return 'G мажор';
  if (notes.includes('E') && notes.includes('G#') && notes.includes('B')) return 'E мажор';
  if (notes.includes('F') && notes.includes('A') && notes.includes('C')) return 'F мажор';
  if (notes.includes('B') && notes.includes('D#') && notes.includes('F#')) return 'B мажор';

  // Minor chords
  if (notes.includes('A') && notes.includes('C') && notes.includes('E')) return 'A мінор';
  if (notes.includes('D') && notes.includes('F') && notes.includes('A')) return 'D мінор';
  if (notes.includes('E') && notes.includes('G') && notes.includes('B')) return 'E мінор';

  return 'Невідомий акорд';
}