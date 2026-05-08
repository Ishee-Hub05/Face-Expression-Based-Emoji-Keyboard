# Face-Expression-Based Emoji Keyboard 😃⌨️

A real-time AI-powered browser extension that detects facial expressions using computer vision and automatically converts them into emojis. Built using JavaScript, face-api.js, and Chrome Extension Manifest V3.

## 📌 Project Overview

The Face-Expression-Based Emoji Keyboard is a smart browser extension that uses webcam input and machine learning to recognize human emotions such as happy, sad, angry, surprised, and neutral in real time. The detected expression is instantly mapped to an emoji and can be inserted directly into any text field with a single click.

This project improves digital communication by reducing the need for manual emoji searching and selection.

---

## 🚀 Features

- Real-time facial expression detection
- Automatic emoji generation
- One-click emoji insertion into text fields
- Offline processing (No server communication)
- Privacy-friendly design
- Lightweight and fast detection using TinyFaceDetector
- Works on websites like:
  - WhatsApp Web
  - YouTube
  - Instagram
  - Facebook
  - Google Search
  - Chat applications

---

## 🧠 Technologies Used

- HTML5
- CSS3
- JavaScript (ES6)
- face-api.js
- TensorFlow.js
- Chrome Extension Manifest V3
- TinyFaceDetector
- FaceExpressionNet

---

## ⚙️ How It Works

1. The extension accesses the user's webcam using `getUserMedia()`.
2. Live video frames are processed using `face-api.js`.
3. The system detects facial expressions in real time.
4. Expressions are mapped to corresponding emojis:
   - Happy → 😁
   - Sad → ☹️
   - Angry → 😡
   - Surprised → 😮
   - Neutral → 😐
5. The detected emoji is displayed in the popup UI.
6. Clicking the emoji inserts it into the active text field.

---

## 📂 Project Structure

``` id="pifv5n"
Face-Emoji-Keyboard/
│── manifest.json
│── popup.html
│── popup.js
│── styles.css
│── background.js
│── interceptor.js
│── face-api.min.js
│── models_encoded.js
│── /models
│    ├── tiny_face_detector_model-shard1
│    ├── face_expression_model-shard1
│    └── weights_manifest.json
```
---

## 🛠️ Installation & Setup 
Step 1: Clone the Repository 
git clone https://github.com/Ishee-Hub05/face-emoji-keyboard.git 
Step 2: Open Chrome Extensions 
Go to: chrome://extensions/ 
Step 3: Enable Developer Mode 
Turn on Developer Mode from the top-right corner. 
Step 4: Load Extension 
Click Load unpacked and select the project folder. 
Step 5: Allow Camera Permission 
Open the extension and allow webcam access 

---

🎯 Learning Objectives 
-This project helped in understanding: 
-Real-time facial expression recognition 
-Computer Vision concepts 
-Browser Extension development 
-Machine Learning integration in browsers 
-Chrome Extension APIs 
-Webcam handling using JavaScript 
-Client-side AI processing 
-Privacy-focused application development 

---

🔒 Privacy & Security 
-No video data is stored 
-No data is uploaded to servers 
-All processing happens locally in the browser 
-Camera access requires user permission 
-Fully offline ML model execution 
