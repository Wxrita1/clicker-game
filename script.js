const startButton = document.getElementById('startButton');
const clickButton = document.getElementById('clickButton');
const scoreDisplay = document.getElementById('scoreDisplay');
const timerDisplay = document.getElementById('timerDisplay');

let score = 0;
let timeLeft = 10;
let timerInterval = null;

let lastClickTime = 0;
let comboCount = 0;
let startButtonEnabled = true;

startButton.addEventListener('click', () => {
  if (!startButtonEnabled) return;
  startGame();
});

clickButton.addEventListener('click', () => {
  addPoint();
});

function showElement(element) {
  element.style.display = 'inline-block';
  element.classList.remove('fade-out');
  element.classList.add('fade-in');
}

function hideElement(element) {
  element.classList.remove('fade-in');
  element.classList.add('fade-out');
  element.addEventListener('animationend', () => {
    element.style.display = 'none';
  }, { once: true });
}

function startGame() {
  score = 0;
  timeLeft = 10;
  comboCount = 0;
  lastClickTime = 0;

  scoreDisplay.innerText = "Score: 0";
  timerDisplay.innerText = "Time: 10";
  timerDisplay.classList.remove('timer-warning');
  timerDisplay.style.display = "block";

  hideElement(startButton);
  showElement(clickButton);

  clickButton.disabled = false;
  startButton.disabled = true;

  clickButton.style.left = '50%';
  clickButton.style.top = '50%';
  clickButton.style.transform = 'translate(-50%, -50%)';

  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  if (timeLeft > 0) {
    timeLeft--;
    timerDisplay.innerText = "Time: " + timeLeft;

    if (timeLeft <= 3) {
      timerDisplay.classList.add('timer-warning');
    } else {
      timerDisplay.classList.remove('timer-warning');
    }
  } else {
    endGame();
  }
}

function endGame() {
  clearInterval(timerInterval);
  hideElement(clickButton);
  timerDisplay.style.display = 'none';

  startButtonEnabled = false;
  showElement(startButton);
  startButton.disabled = true;
  clickButton.disabled = true;

  alert("Game Over! Your score: " + score);

  setTimeout(() => {
    startButtonEnabled = true;
    startButton.disabled = false;
    clickButton.disabled = false;
  }, 3000);
}

function addPoint() {
  const now = Date.now();

  if (now - lastClickTime < 500) {
    comboCount++;
  } else {
    comboCount = 1;
  }

  lastClickTime = now;

  const points = 1 + Math.floor(comboCount / 3);
  score += points;
  scoreDisplay.innerText = "Score: " + score;

  if (points > 1) showComboText(`+${points}`);

  moveButtonRandomly();

  clickButton.classList.add('flash');
  clickButton.addEventListener('animationend', () => {
    clickButton.classList.remove('flash');
  }, { once: true });

  clickButton.classList.remove('fade-out');
  clickButton.classList.add('fade-in');
}

function showComboText(text) {
  const comboContainer = document.getElementById('comboContainer');
  const combo = document.createElement('div');
  combo.className = 'comboText';
  combo.innerText = text;

  const rect = clickButton.getBoundingClientRect();
  combo.style.left = rect.left + rect.width / 2 + 'px';
  combo.style.top = rect.top + rect.height / 2 + 'px';

  comboContainer.appendChild(combo);

  combo.addEventListener('animationend', () => {
    combo.remove();
  });
}

function moveButtonRandomly() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const btnWidth = clickButton.offsetWidth;
  const btnHeight = clickButton.offsetHeight;

  const margin = 20;
  const maxX = vw - btnWidth - margin;
  const maxY = vh - btnHeight - margin;
  const minX = margin;
  const minY = margin;

  if (maxX <= minX || maxY <= minY) {
    clickButton.style.left = '50%';
    clickButton.style.top = '50%';
    clickButton.style.transform = 'translate(-50%, -50%)';
  } else {
    const randomX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
    const randomY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

    clickButton.style.left = randomX + 'px';
    clickButton.style.top = randomY + 'px';
    clickButton.style.transform = '';
  }

  clickButton.style.backgroundColor = getRandomColor();
}

function getRandomColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 60%)`;
}
