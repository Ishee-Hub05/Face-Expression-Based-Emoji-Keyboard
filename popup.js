console.log("Face API emoji detector starting...");

const video = document.getElementById("video");
const emojiEl = document.getElementById("emoji");
const statusEl = document.getElementById("status");

function setStatus(msg) {
  statusEl.textContent = "Status: " + msg;
}


// ---------------- CAMERA ----------------
async function initCamera() {
  try {
    setStatus("Requesting camera access...");

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { 
        facingMode: "user",   // prefer front camera
        width: { ideal: 640 },
        height: { ideal: 480 }
      }
    });

    video.srcObject = stream;
    await video.play();

    setStatus("Camera started ✔");
    console.log("✅ Camera stream started successfully");
    return true;  // ← signal success
  } catch (err) {
    console.error("Camera error:", err.name, err.message);
    
    if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
      setStatus("Camera access denied ❌ – Close this window, allow camera in Chrome settings, then try again");
    } else if (err.name === "NotFoundError") {
      setStatus("No camera found ❌");
    } else {
      setStatus("Camera error ❌ " + err.name);
    }
    return false;  // ← signal failure
  }
}

// ---------------- DIAGNOSTIC LOGGING ----------------
function showDiagnostic(title, err) {
  const div = document.createElement("div");
  div.style.position = "fixed";
  div.style.top = "0"; div.style.left = "0"; div.style.right = "0"; div.style.bottom = "0";
  div.style.background = "#900"; div.style.color = "#fff";
  div.style.zIndex = "9999"; div.style.padding = "20px"; div.style.overflow = "auto";
  div.style.fontFamily = "monospace";
  const safeErr = err ? (err.stack || err.message || err.toString()) : "No error details";
  div.innerHTML = `<h3>🚨 ${title}</h3><hr><pre style="white-space:pre-wrap;">${safeErr}</pre>`;
  document.body.appendChild(div);
}

// ---------------- MODELS ----------------
async function loadModels() {
  try {
    setStatus("Loading models...");
    let baseModelUrl = chrome.runtime.getURL("models");

    setStatus("Loading Face Detector...");
    await faceapi.nets.tinyFaceDetector.loadFromUri(baseModelUrl);

    setStatus("Loading Expression Net...");
    await faceapi.nets.faceExpressionNet.loadFromUri(baseModelUrl);

    setStatus("Models loaded ✔");
    console.log("✅ Both models loaded successfully!");
    
    // Remove red screen if it exists from previous load
    const errBox = document.querySelector("div[style*='background: rgb(153, 0, 0)']");
    if (errBox) errBox.remove();
    
    return true;

  } catch (err) {
    console.error("Model loading error:", err);
    if (!document.querySelector("div[style*='background: rgb(153, 0, 0)']")) {
      showDiagnostic("Failed to Load Models", err);
    }
    return false;
  }
}


// ---------------- EMOJI LOGIC ----------------
function exprToEmoji(expr) {
  if (!expr) return "😐";

  const max = Object.entries(expr).reduce((a, b) =>
    a[1] > b[1] ? a : b
  )[0];

  switch (max) {
    case "happy":
      return "😁";
    case "surprised":
      return "😮";
    case "angry":
      return "😡";
    case "sad":
      return "☹️";
    case "fearful":
      return "😨";
    case "disgusted":
      return "🤢";
    default:
      return "😐";
  }
}

// ---------------- DETECTION LOOP ----------------
async function detectLoop() {
  // Safety guard: abort if models aren't loaded (prevents TinyYolov2 "load model before inference" error)
  if (!faceapi.nets.tinyFaceDetector.isLoaded || !faceapi.nets.faceExpressionNet.isLoaded) {
    setStatus("❌ Models not loaded — cannot detect");
    console.error("detectLoop() called but models are not loaded!");
    return;
  }

  if (video.readyState !== 4) {
    requestAnimationFrame(detectLoop);
    return;
  }

  try {
    const result = await faceapi
      .detectSingleFace(
        video,
        new faceapi.TinyFaceDetectorOptions()
      )
      .withFaceExpressions();

    if (result) {
      const emoji = exprToEmoji(result.expressions);
      emojiEl.textContent = emoji;
      setStatus("Detected: " + emoji);
    } else {
      setStatus("No face detected");
    }
  } catch (err) {
    console.error("Detection error:", err);
  }

  requestAnimationFrame(detectLoop);
}

// ---------------- INSERT INTO PAGE ----------------
async function insertEmojiIntoPage(emoji) {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (emoji) => {
        const el = document.activeElement;

        if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) {
          const start = el.selectionStart;
          const end = el.selectionEnd;

          el.value =
            el.value.slice(0, start) +
            emoji +
            el.value.slice(end);

          el.selectionStart = el.selectionEnd = start + emoji.length;
        }
      },
      args: [emoji]
    });

    setStatus("Inserted " + emoji);
  } catch (err) {
    await navigator.clipboard.writeText(emoji);
    setStatus("Copied " + emoji + " (clipboard)");
  }
}

// ---------------- CLICK HANDLER ----------------
emojiEl.addEventListener("click", () => {
  insertEmojiIntoPage(emojiEl.textContent);
});

// ---------------- START ----------------
async function start() {
  setStatus("Initializing...");

  // Guard: check that face-api.js loaded correctly
  if (typeof faceapi === "undefined") {
    setStatus("❌ face-api.js failed to load. Reload the extension.");
    console.error("faceapi is not defined — face-api.min.js may be missing or blocked.");
    return;
  }

  // Start camera
  const cameraOk = await initCamera();
  if (!cameraOk) {
    // Camera failed — still try loading models so they're ready for next open
    await loadModels();
    return;  // Do NOT start detection loop without a working camera
  }

  // Load models
  const modelsOk = await loadModels();
  if (!modelsOk) {
    setStatus("❌ Models failed to load. Reload the extension and try again.");
    return;  // Do NOT call detectLoop() — this was the root cause of the TinyYolov2 error
  }

  // Both camera and models ready — start detection
  setStatus("Ready! Show your face 😊");
  detectLoop();
}

start();