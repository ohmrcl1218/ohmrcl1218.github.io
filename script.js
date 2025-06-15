document.addEventListener("DOMContentLoaded", function () {
  const cake = document.querySelector(".cake");
  const candleCountDisplay = document.getElementById("candleCount");
  let candles = [];
  let audioContext;
  let analyser;
  let microphone;
  let audio = new Audio('hbd.mp3');


  function updateCandleCount() {
    const activeCandles = candles.filter(
      (candle) => !candle.classList.contains("out")
    ).length;
    candleCountDisplay.textContent = activeCandles;
  }

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

  cake.addEventListener("click", function (event) {
    const rect = cake.getBoundingClientRect();
    const left = event.clientX - rect.left;
    const top = event.clientY - rect.top;
    addCandle(left, top);
  });

  function isBlowing() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    let average = sum / bufferLength;

    return average > 50; //ETO CHANGEEEEEE
  }

  function blowOutCandles() {
    let blownOut = 0;

    // Only check for blowing if there are candles and at least one is not blown out
    if (candles.length > 0 && candles.some((candle) => !candle.classList.contains("out"))) {
      if (isBlowing()) {
        candles.forEach((candle) => {
          if (!candle.classList.contains("out") && Math.random() > 0.5) {
            candle.classList.add("out");
            blownOut++;
          }
        });
      }

      if (blownOut > 0) {
        updateCandleCount();
      }

      // If all candles are blown out, trigger confetti after a small delay
      if (candles.every((candle) => candle.classList.contains("out"))) {
        setTimeout(function() {
          triggerConfetti();
          endlessConfetti(); // Start the endless confetti
        }, 200);
        audio.play();
      }
    }
  }



  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        setInterval(blowOutCandles, 200);
      })
      .catch(function (err) {
        console.log("Unable to access microphone: " + err);
      });
  } else {
    console.log("getUserMedia not supported on your browser!");
  }
});

function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}

function endlessConfetti() {
  setInterval(function() {
    confetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0 }
    });
  }, 1000);
}

// After all candles are blown out (inside blowOutCandles()):
setTimeout(() => {
  showMessageButton(); // Show "See My Message" button
}, 1000);

function showMessageButton() {
  const btn = document.createElement("button");
  btn.id = "messageBtn";
  btn.textContent = "See My Message 💌";
  btn.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 20px;
    background: #ff8fab;
    border: none;
    border-radius: 20px;
    color: white;
    font-size: 18px;
    cursor: pointer;
    z-index: 1000;
  `;
  document.body.appendChild(btn);

  btn.addEventListener("click", () => {
    btn.remove();
    showHeartMessage(); // Trigger heart + message
  });
}

function showHeartMessage() {
  // Append your HTML/CSS for the heart message (see below)
  const messageHTML = `
    <div class="container">
      <label>
        <div class="heart">
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/42/Love_Heart_SVG.svg">
        </div>
        <input id="messageState" type="checkbox" style="display:none"/>
      </label>
      <div class="message closed">
        <h1>Happy Valentine's Day My Love</h1>
        <p>${yourLongMessage}</p> 
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", messageHTML);

  // Trigger heart animation on click
  document.querySelector(".heart").addEventListener("click", () => {
    document.getElementById("messageState").checked = true;
  });
}
