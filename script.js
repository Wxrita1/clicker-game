const startButton = document.getElementById('startButton');
const clickButton = document.getElementById('clickButton');
const timerDisplay = document.getElementById('timerDisplay');
const scoreDisplay = document.getElementById('scoreDisplay');
const comboText = document.getElementById('comboText');
const highScoreDisplay = document.getElementById('highScoreDisplay');

const modeToggle = document.getElementById('modeToggle');
const modeLabel = document.getElementById('modeLabel');

let score = 0;
let timeLeft = 10;
let timerInterval;
let isGameRunning = false;

let highScore = localStorage.getItem('highScore') || 0;
highScoreDisplay.textContent = `High Score: ${highScore}`;

let consecutiveClicks = 0; // combo counter

function resetGame() {
  score = 0;
  timeLeft = 10;
  scoreDisplay.textContent = `Score: ${score}`;
  timerDisplay.textContent = timeLeft.toFixed(2);
  timerDisplay.classList.remove('red');
  comboText.textContent = '';
  comboText.classList.remove('show');
  isGameRunning = false;
  clickButton.style.display = 'none';
  startButton.style.display = 'inline-block';
  startButton.textContent = 'Start Game';
  startButton.disabled = false;
  clickButton.style.position = 'fixed'; // keep fixed to move anywhere on viewport
  clickButton.style.opacity = '1';
}

function startGame() {
  consecutiveClicks = 0;  // Reset combo count on game start
  isGameRunning = true;
  score = 0;
  timeLeft = 10;
  scoreDisplay.textContent = `Score: ${score}`;
  timerDisplay.textContent = timeLeft.toFixed(2);
  timerDisplay.classList.remove('red');
  comboText.textContent = '';
  comboText.classList.remove('show');

  startButton.style.display = 'none';

  placeButtonRandomly();
  clickButton.style.display = 'inline-flex';
  clickButton.disabled = false;

  timerInterval = setInterval(() => {
    timeLeft -= 0.01;
    if (timeLeft <= 3) {
      timerDisplay.classList.add('red');
    } else {
      timerDisplay.classList.remove('red');
    }

    if (timeLeft <= 0) {
      timeLeft = 0;
      endGame();
    }

    timerDisplay.textContent = timeLeft.toFixed(2);
  }, 10);
}

function endGame() {
  clearInterval(timerInterval);
  isGameRunning = false;
  clickButton.disabled = true;
  timerDisplay.textContent = '0.00';
  timerDisplay.classList.remove('red');

  // Check and update high score
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore);
    highScoreDisplay.textContent = `High Score: ${highScore}`;
  }

  clickButton.style.display = 'none';
  startButton.style.display = 'inline-block';
  startButton.textContent = 'Start Game';
  startButton.disabled = true;

  // Enable start button after 3 seconds hold to prevent immediate restart
  setTimeout(() => {
    startButton.disabled = false;
  }, 3000);
}

function placeButtonRandomly() {
  const btnWidth = clickButton.offsetWidth;
  const btnHeight = clickButton.offsetHeight;

  const maxX = window.innerWidth - btnWidth;
  const maxY = window.innerHeight - btnHeight;

  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY);

  clickButton.style.left = randomX + 'px';
  clickButton.style.top = randomY + 'px';

  clickButton.style.backgroundColor = getRandomColor();
}

function getRandomColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 60%)`;
}

function showComboText(text) {
  comboText.textContent = text;
  comboText.classList.add('show');

  if (comboText.fadeTimeout) clearTimeout(comboText.fadeTimeout);

  comboText.fadeTimeout = setTimeout(() => {
    comboText.classList.remove('show');
  }, 800);
}

function showBonusPoints(points, x, y) {
  const bonus = document.createElement('div');
  bonus.classList.add('bonusPoints');
  bonus.textContent = `+${points}`;
  document.body.appendChild(bonus);

  bonus.style.left = x + 'px';
  bonus.style.top = y + 'px';

  // Animate upward and fade out
  setTimeout(() => {
    bonus.style.transform = 'translateY(-50px)';
    bonus.style.opacity = '0';
  }, 50);

  setTimeout(() => {
    bonus.remove();
  }, 1050);
}

clickButton.addEventListener('click', (e) => {
  if (!isGameRunning) return;

  score++;
  consecutiveClicks++;

  scoreDisplay.textContent = `Score: ${score}`;

  // Show combo messages and bonus points
  if (consecutiveClicks >= 4) {
    showComboText('Amazing! +3 Bonus');
    score += 3;
    scoreDisplay.textContent = `Score: ${score}`;
    showBonusPoints(3, e.clientX, e.clientY);
    consecutiveClicks = 0; // reset combo after bonus
  } else if (consecutiveClicks === 3) {
    showComboText('Great! +2 Bonus');
    score += 2;
    scoreDisplay.textContent = `Score: ${score}`;
    showBonusPoints(2, e.clientX, e.clientY);
  } else if (consecutiveClicks === 2) {
    showComboText('Nice! +1 Bonus');
    score += 1;
    scoreDisplay.textContent = `Score: ${score}`;
    showBonusPoints(1, e.clientX, e.clientY);
  } else {
    comboText.classList.remove('show');
  }

  placeButtonRandomly();
});

startButton.addEventListener('click', () => {
  if (startButton.disabled) return;
  startGame();
});

// Dark/Light mode toggle logic
function applyMode(isDark) {
  if (isDark) {
    document.body.classList.add('dark-mode');
    modeLabel.textContent = 'Dark Mode';
    modeToggle.checked = true;
  } else {
    document.body.classList.remove('dark-mode');
    modeLabel.textContent = 'Light Mode';
    modeToggle.checked = false;
  }
}

const savedMode = localStorage.getItem('darkMode') === 'true';
applyMode(savedMode);

modeToggle.addEventListener('change', () => {
  applyMode(modeToggle.checked);
  localStorage.setItem('darkMode', modeToggle.checked);
});

// Initialize the game state on page load
resetGame();
