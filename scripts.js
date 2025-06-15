function suggestExercises(analysis) {
  let exercises = [];
  if (analysis.pitchStability === 'low') {
    exercises.push('Виконуйте вправи на утримання тону (довгі ноти, повільне легато).');
  }
  if (analysis.chordVariety === 'low') {
    exercises.push('Вчіть нові акорди та пробуйте їх комбінувати.');
  }
  if (analysis.tempo === 'slow') {
    exercises.push('Грайте з метрономом, поступово збільшуючи темп.');
  }
  return exercises.join(' ');
}

// Check if we are on the suggestions.html page by looking for specific elements
const suggestionForm = document.getElementById('suggestionForm');
const suggestionResult = document.getElementById('suggestionResult');

if (suggestionForm) {
  suggestionForm.onsubmit = function (e) {
    e.preventDefault();

    // Get user input
    const instrument = document.getElementById('instrument').value;
    const dailyTime = parseInt(document.getElementById('dailyTime').value, 10);
    const daysPerWeek = parseInt(document.getElementById('daysPerWeek').value, 10);
    const goal = document.getElementById('goal').value;

    // Generate predefined recommendations
    const recommendations = generatePredefinedRecommendations(instrument, dailyTime, daysPerWeek, goal);

    // Display recommendations
    const suggestionText = document.getElementById('suggestionText');
    suggestionText.textContent = recommendations;
    suggestionResult.classList.remove('d-none');
  };
}

// Function to generate predefined recommendations based on user input
function generatePredefinedRecommendations(instrument, dailyTime, daysPerWeek, goal) {
  let recommendations = `Ви обрали інструмент: ${instrument}. Ваша мета: "${goal}". `;
  recommendations += `Ви плануєте займатися ${dailyTime} хвилин на день, ${daysPerWeek} днів на тиждень. `;

  // Add specific recommendations based on the instrument
  if (instrument === 'guitar') {
    recommendations += 'Рекомендуємо почати з базових акордів (C, G, D, Am, Em) та вправ на зміну акордів. ';
    if (goal.toLowerCase().includes('fingerstyle')) {
      recommendations += 'Спробуйте вправи на арпеджіо та техніку fingerstyle. ';
    } else if (goal.toLowerCase().includes('соло')) {
      recommendations += 'Зосередьтеся на гамах та техніці легато для гри соло. ';
    }
  } else if (instrument === 'piano') {
    recommendations += 'Рекомендуємо почати з гам (C мажор, G мажор) та простих мелодій, таких як "Twinkle Twinkle Little Star". ';
    if (goal.toLowerCase().includes('до елізи')) {
      recommendations += 'Вивчіть основи нотного запису та вправи на легато. ';
    } else if (goal.toLowerCase().includes('джаз')) {
      recommendations += 'Спробуйте вправи на імпровізацію та акордові прогресії в стилі джазу. ';
    }
  } else if (instrument === 'violin') {
    recommendations += 'Рекомендуємо вправи на утримання смичка та прості мелодії, такі як "Ода до радості". ';
    if (goal.toLowerCase().includes('оркестр')) {
      recommendations += 'Зосередьтеся на техніці гри в ансамблі та читанні партитур. ';
    } else if (goal.toLowerCase().includes('віртуоз')) {
      recommendations += 'Практикуйте швидкі пасажі та техніку подвійних нот. ';
    }
  }

  // Add general recommendations
  if (dailyTime < 30) {
    recommendations += 'Спробуйте збільшити час занять до 30 хвилин для кращого прогресу. ';
  }
  if (daysPerWeek < 3) {
    recommendations += 'Рекомендуємо займатися щонайменше 3 дні на тиждень для стабільного прогресу. ';
  }

  recommendations += 'Не забувайте розминатися перед грою та слухати записи професійних музикантів для натхнення!';

  return recommendations;
}

// Play the generated melody
document.getElementById('generateMelody').onclick = async function () {
  const melodyOutput = document.getElementById('melodyOutput');
  melodyOutput.textContent = 'Завантаження мелодії...';

  try {
    const melodyRNN = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/basic_rnn');
    await melodyRNN.initialize();

    const seed = {
      notes: [
        { pitch: 60, startTime: 0.0, endTime: 0.5 },
        { pitch: 62, startTime: 0.5, endTime: 1.0 },
        { pitch: 64, startTime: 1.0, endTime: 1.5 },
      ],
      totalTime: 1.5,
    };

    const steps = 32;
    const temperature = 1.0;
    const generatedSequence = await melodyRNN.continueSequence(seed, steps, temperature);

    melodyOutput.textContent = 'Згенерована мелодія:';
    const ul = document.createElement('ul');
    ul.className = 'list-group mt-2';
    generatedSequence.notes.forEach((note, index) => {
      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.textContent = `Нота ${index + 1}: ${note.pitch} (від ${note.startTime.toFixed(2)}с до ${note.endTime.toFixed(2)}с)`;
      ul.appendChild(li);
    });
    melodyOutput.appendChild(ul);

    // Play the generated melody
    const player = new mm.Player();
    player.start(generatedSequence);

    melodyRNN.dispose();
  } catch (error) {
    console.error('Error generating melody:', error);
    melodyOutput.textContent = 'Сталася помилка при генерації мелодії. Спробуйте пізніше.';
  }
};