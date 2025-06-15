# SmartMusicLearn 🎵

SmartMusicLearn is an interactive web application designed to help musicians improve their skills through analysis, chord recognition, melody generation, and personalized recommendations. 
This project combines modern web technologies with AI-powered tools to provide a unique learning experience for musicians of all levels.

---

## Features

### 1. **Online Playing Analysis**
- **What it does**: Records your playing and analyzes the pitch, tempo, and note stability.
- **How it works**: Uses the `ml5.js` library for pitch detection, powered by machine learning models.
- **Why it's useful**: Provides feedback on your playing, such as tone stability and tempo, and offers recommendations for improvement.

### 2. **Chord Recognition**
- **What it does**: Recognizes chords in real-time as you play.
- **How it works**: Uses the `ml5.js` library to detect frequencies and map them to musical notes. Then, it identifies chords based on the detected notes.
- **Why it's useful**: Helps you understand the chords you're playing and improve your chord transitions.

### 3. **Melody Generation (New Feature!)**
- **What it does**: Generates melodies based on a predefined seed and allows users to play the generated melody.
- **How it works**: Uses the `Magenta.js` library, which is built on TensorFlow.js, to generate melodies using a pre-trained `MusicRNN` model.
- **Why it's useful**: Provides a creative tool for musicians to explore new melodies and practice improvisation.

### 4. **Personalized Recommendations**
- **What it does**: Provides tailored recommendations for improving your skills based on your instrument, practice time, and goals.
- **How it works**: Uses predefined recommendations that dynamically adapt to user input.
- **Why it's useful**: Offers actionable advice to help you achieve your musical goals.

---

## Technologies Used

### **Frontend**
- **HTML5**: For structuring the web pages.
- **CSS3**: For styling the application.
- **Bootstrap**: For responsive design and prebuilt UI components.

### **JavaScript**
- **Core JavaScript**: For interactivity and dynamic content.
- **ml5.js**: A machine learning library built on TensorFlow.js that simplifies AI integration into web projects.
  - **How ml5.js works**: It provides pre-trained machine learning models (e.g., for pitch detection) that run directly in the browser. For example:
    - In the **Chord Recognition** feature, `ml5.js` detects audio frequencies and maps them to musical notes.
    - In the **Game Analysis** feature, it analyzes pitch stability and tempo to provide feedback.
- **Magenta.js**: A library for music generation and manipulation, built on TensorFlow.js.
  - **How Magenta.js works**: It uses pre-trained models like `MusicRNN` to generate melodies based on a seed sequence. The generated melodies can be played back or displayed for practice.

---

## How to Use the Application

1. **Clone or Download the Project**:
   - Clone the repository or download the project files to your local machine.

2. **Open the Application**:
   - Open `index.html` in your browser to access the main page.

3. **Explore the Features**:
   - **Game Analysis**: Navigate to the "Аналіз гри" section to record your playing and receive feedback.
   - **Chord Recognition**: Navigate to the "Розпізнавання акордів" section to detect chords in real-time.
   - **Melody Generation**: Navigate to the "AI Рекомендації для розвитку гри" section and click "Згенерувати мелодію" to generate and play a melody.
   - **Personalized Recommendations**: Navigate to the "AI Рекомендації для розвитку гри" section to get tailored advice for improving your skills.

---

## AI and Machine Learning in SmartMusicLearn

This project leverages AI and machine learning in the following ways:

### **1. ml5.js for Pitch Detection**
- **What it is**: `ml5.js` is a high-level JavaScript library built on TensorFlow.js. It simplifies the use of machine learning models in web applications.
- **How it's used**:
  - In the **Chord Recognition** feature, `ml5.js` detects audio frequencies and maps them to musical notes.
  - In the **Game Analysis** feature, it analyzes the pitch of the notes you play and provides feedback on tone stability and tempo.

### **2. Magenta.js for Melody Generation**
- **What it is**: `Magenta.js` is a library for music generation and manipulation, built on TensorFlow.js.
- **How it's used**:
  - In the **Melody Generation** feature, `Magenta.js` uses a pre-trained `MusicRNN` model to generate melodies based on a predefined seed.
  - The generated melodies are displayed as a list of notes with their pitches and timings, and users can play the melodies directly in the browser.

### **3. Predefined Recommendations**
- The project uses a predefined recommendation system that dynamically adapts to user input, such as the instrument, practice time, and goals.

---

## Future Improvements

1. **Enhanced Recommendations**:
   - Expand the predefined recommendation system to include more detailed and diverse advice.

2. **Improved Chord Recognition**:
   - Add support for more complex chords and progressions.

3. **User Profiles**:
   - Implement user accounts to save progress and track improvements over time.

4. **Mobile Optimization**:
   - Further optimize the application for mobile devices to enhance usability.

5. **Custom Melody Input**:
   - Allow users to input their own seed melodies for generation.

---

## Conclusion

SmartMusicLearn is a powerful tool for musicians looking to improve their skills. By combining modern web technologies with AI-powered tools like `ml5.js` and `Magenta.js`, 
it provides an engaging and interactive learning experience. Whether you're analyzing your playing, recognizing chords, generating melodies, or seeking personalized advice, 
SmartMusicLearn has something to offer for every musician.

---

## Credits

- **Developer**: [Mykhailo Leus]
- **Libraries Used**:
  - [ml5.js](https://ml5js.org/)
  - [Magenta.js](https://magenta.tensorflow.org/)
  - [Bootstrap](https://getbootstrap.com/)
- **Icons**: [Bootstrap Icons](https://icons.getbootstrap.com/)
