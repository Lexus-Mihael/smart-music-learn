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