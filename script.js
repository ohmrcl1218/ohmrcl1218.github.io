function blowOutCandles() {
  let blownOut = 0;

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

    if (candles.every((candle) => candle.classList.contains("out"))) {
      setTimeout(function() {
        triggerConfetti();
        endlessConfetti();
        audio.play();
        // Show the popup after blowing all candles
        document.getElementById("birthdayPopup").style.display = "flex";
      }, 200);
    }
  }
}

// Add these new event listeners (place at the bottom of your JS file):
document.getElementById("seeMessageBtn").addEventListener("click", function() {
  document.getElementById("birthdayPopup").style.display = "none";
  document.getElementById("birthdayLetter").style.display = "block";
});

document.querySelector(".close-letter").addEventListener("click", function() {
  document.getElementById("birthdayLetter").style.display = "none";
});
