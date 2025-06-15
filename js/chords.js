// js/chords.js
const startBtn = document.getElementById('startChord');
const stopBtn  = document.getElementById('stopChord');
const resultEl = document.getElementById('chordResult');
const listEl   = document.getElementById('chordList');

let audioContext, mediaRecorder, chunks = [];
async function initRecording() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.ondataavailable = e => chunks.push(e.data);
}

startBtn.onclick = async () => {
  if (!mediaRecorder) await initRecording();
  chunks = [];
  mediaRecorder.start();
  startBtn.disabled = true;
  stopBtn.disabled  = false;
  setTimeout(() => stopBtn.click(), 5000); // автозупинка через 5 с
};

stopBtn.onclick = () => {
  mediaRecorder.stop();
  stopBtn.disabled = true;
};

mediaRecorder?.addEventListener('stop', async () => {
  const blob = new Blob(chunks, { type: 'audio/webm' });
  const arrayBuffer = await blob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  // Виклик Magenta.js OnsetsAndFrames
  const model = new mm.OnsetsAndFrames();
  await model.initialize();
  const noteSeq = await model.transcribe(audioBuffer);

  // Групування нот у акорди (простий підхід)
  const chords = groupNotesToChords(noteSeq.notes);

  listEl.innerHTML = '';
  chords.forEach((chord, i) => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.textContent = `Акорд ${i+1}: ${chord.name} (ноти: ${chord.notes.join(', ')})`;
    listEl.appendChild(li);
  });

  // Додати рекомендації
  const recLi = document.createElement('li');
  recLi.className = 'list-group-item text-primary';
  recLi.textContent = 'Рекомендації: ' + getChordRecommendations(chords);
  listEl.appendChild(recLi);

  resultEl.classList.remove('d-none');
});

// Простий алгоритм для групування нот у акорди
function groupNotesToChords(notes) {
  // Групуємо ноти за часом (наприклад, кожні 0.5 сек)
  const groups = [];
  let group = [];
  let lastTime = null;
  notes.forEach(note => {
    if (lastTime === null || note.startTime - lastTime < 0.5) {
      group.push(note.pitch);
    } else {
      groups.push(group);
      group = [note.pitch];
    }
    lastTime = note.startTime;
  });
  if (group.length) groups.push(group);

  // Визначаємо назву акорду (дуже спрощено)
  return groups.map(g => ({
    notes: g.map(pitchToNoteName),
    name: guessChordName(g.map(pitchToNoteName))
  }));
}

function pitchToNoteName(pitch) {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  return noteNames[pitch % 12];
}

function guessChordName(notes) {
  // Дуже простий підхід: якщо є C, E, G — це C; D, F#, A — D і т.д.
  if (notes.includes('C') && notes.includes('E') && notes.includes('G')) return 'C';
  if (notes.includes('D') && notes.includes('F#') && notes.includes('A')) return 'D';
  if (notes.includes('G') && notes.includes('B') && notes.includes('D')) return 'G';
  // ...додайте ще акорди...
  return 'Невідомий акорд';
}

function getChordRecommendations(chords) {
  if (chords.length === 0) return 'Недостатньо даних для аналізу акордів.';
  const uniqueChords = [...new Set(chords.map(c => c.name))];
  if (uniqueChords.length < 2) {
    return 'Спробуйте грати різні акорди для розвитку гармонічного слуху.';
  }
  return 'Ви використовуєте різноманітні акорди! Продовжуйте в тому ж дусі.';
}