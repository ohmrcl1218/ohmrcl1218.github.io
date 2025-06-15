document.addEventListener("DOMContentLoaded", function () {
  const cake = document.querySelector(".cake");
  const candleCountDisplay = document.getElementById("candleCount");
  let candles = [];
  let audioContext;
  let analyser;
  let microphone;
  let audio = new Audio('hbd.mp3');

  // Add candle on click
  cake.addEventListener("click", function (event) {
    const rect = cake.getBoundingClientRect();
    const left = event.clientX - rect.left;
    const top = event.clientY - rect.top;
    addCandle(left, top);
  });

  function addCandle(left, top) {
    const candle = document.createElement("div");
    candle.className = "candle";
    candle.style.left = left + "px";
    candle.style.top = top + "px";

    const flame = document.createElement("div");
    flame.className = "flame";
    candle.appendChild(flame);

    cake.appendChild(candle);
    candles.push(candle);
    updateCandleCount();
  }

  function updateCandleCount() {
    const activeCandles = candles.filter(
      (candle) => !candle.classList.contains("out")
    ).length;
    candleCountDisplay.textContent = activeCandles;
  }

  function isBlowing() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);
    let sum = dataArray.reduce((a, b) => a + b, 0);
    return sum / bufferLength > 50; // Adjust sensitivity
  }

  function blowOutCandles() {
    if (candles.length === 0) return;

    let blownOut = 0;
    if (isBlowing()) {
      candles.forEach((candle) => {
        if (!candle.classList.contains("out") && Math.random() > 0.5) {
          candle.classList.add("out");
          blownOut++;
        }
      });
    }

    if (blownOut > 0) updateCandleCount();

    // All candles blown out
    if (candles.every(c => c.classList.contains("out"))) {
      setTimeout(() => {
        triggerConfetti();
        endlessConfetti();
        audio.play();
        document.getElementById("birthdayPopup").style.display = "flex";
      }, 200);
    }
  }

  // Microphone setup
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(function (stream) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        setInterval(blowOutCandles, 200);
      })
      .catch(function (err) {
        console.log("Microphone access denied:", err);
      });
  }

  // Popup & letter controls
  document.getElementById("seeMessageBtn").addEventListener("click", () => {
    document.getElementById("birthdayPopup").style.display = "none";
    document.getElementById("birthdayLetter").style.display = "block";
  });

  document.querySelector(".close-letter").addEventListener("click", () => {
    document.getElementById("birthdayLetter").style.display = "none";
  });
});

// Confetti functions
function triggerConfetti() {
  confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
}
function endlessConfetti() {
  setInterval(() => {
    confetti({ particleCount: 20, spread: 90, origin: { y: 0 } });
  }, 1000);
}
