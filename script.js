let score = 0;

// Bigger click sound embedded as base64 wav Data URI
const clickSound = new Audio(
  "data:audio/wav;base64,UklGRlgAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAACgAAAAgAAAAPwAAAD8AAAA/AAAAPwAAAD8AAA=="
);

function playClickSound() {
  clickSound.pause();
  clickSound.currentTime = 0;
  clickSound.play();
}

function addPoint() {
  score++;
  document.getElementById("score").innerText = "Score: " + score;
  playClickSound();
}

function resetScore() {
  score = 0;
  document.getElementById("score").innerText = "Score: " + score;
}
