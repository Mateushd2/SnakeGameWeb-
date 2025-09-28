const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const cols = canvas.width / box;
const rows = canvas.height / box;

// cobra inicial centralizada
let snake = [
  { x: Math.floor(cols/2) * box, y: Math.floor(rows/2) * box },
  { x: Math.floor(cols/2 - 1) * box, y: Math.floor(rows/2) * box },
  { x: Math.floor(cols/2 - 2) * box, y: Math.floor(rows/2) * box }
];

let direction = "RIGHT"; 
let gameInterval = null;
let speed = 100; // velocidade inicial
let score = 0;

document.getElementById("score").textContent = score;

// --------------------
// MENU
// --------------------
const menu = document.getElementById("menu");
const hud = document.querySelector(".hud");
const mobileControls = document.querySelector(".mobile-controls");

// Função para iniciar o jogo
function startGame() {
  menu.classList.add("hidden");
  hud.classList.remove("hidden");
  canvas.classList.remove("hidden");
  mobileControls.classList.remove("hidden");
  if (!gameInterval) gameInterval = setInterval(update, speed);
}

// Botão Play
document.getElementById("playBtn").addEventListener("click", startGame);

// Tecla Enter para iniciar
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !menu.classList.contains("hidden")) {
    startGame();
  }
});

// --------------------
// Comida
// --------------------
function randomFoodPosition() {
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * cols) * box,
      y: Math.floor(Math.random() * rows) * box
    };
  } while (snake.some(seg => seg.x === pos.x && seg.y === pos.y));
  return pos;
}
let food = randomFoodPosition();

// --------------------
// Colisão consigo mesmo
// --------------------
function checkSelfCollision(head, snakeArray) {
  return snakeArray.slice(1).some(seg => seg.x === head.x && seg.y === head.y);
}

// --------------------
// Desenho
// --------------------
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  snake.forEach((seg, idx) => {
    ctx.fillStyle = idx === 0 ? "#2ecc71" : "#7bed9f";
    ctx.fillRect(seg.x, seg.y, box, box);
    ctx.strokeStyle = "#052018";
    ctx.lineWidth = 1;
    ctx.strokeRect(seg.x + 0.5, seg.y + 0.5, box - 1, box - 1);
  });

  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(food.x + box / 2, food.y + box / 2, box / 2 - 2, 0, 2 * Math.PI);
  ctx.fill();
}

// --------------------
// Atualizar jogo
// --------------------
function restartInterval() {
  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(update, speed);
}

function update() {
  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "LEFT") headX -= box;
  if (direction === "UP") headY -= box;
  if (direction === "RIGHT") headX += box;
  if (direction === "DOWN") headY += box;

  // wrap-around
  if (headX < 0) headX = canvas.width - box;
  if (headX >= canvas.width) headX = 0;
  if (headY < 0) headY = canvas.height - box;
  if (headY >= canvas.height) headY = 0;

  const newHead = { x: headX, y: headY };

  // Game Over se bater em si mesmo
  if (checkSelfCollision(newHead, snake)) {
    clearInterval(gameInterval);
    gameInterval = null;
    alert("💥 Game Over! Pontos: " + score);
    return;
  }

  const ateFood = (newHead.x === food.x && newHead.y === food.y);
  snake.unshift(newHead);

  if (ateFood) {
    score++;
    document.getElementById("score").textContent = score;
    food = randomFoodPosition();

    // aumenta velocidade a cada comida
    speed = Math.max(25, speed - 5);
    restartInterval();
  } else {
    snake.pop();
  }

  draw();
}

// --------------------
// Controles teclado
// --------------------
document.addEventListener("keydown", (e) => {
  const key = e.key;
  if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(key)) e.preventDefault();

  if (key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// --------------------
// Controles móveis
// --------------------
document.getElementById("up").addEventListener("click", () => { if (direction !== "DOWN") direction = "UP"; });
document.getElementById("down").addEventListener("click", () => { if (direction !== "UP") direction = "DOWN"; });
document.getElementById("left").addEventListener("click", () => { if (direction !== "RIGHT") direction = "LEFT"; });
document.getElementById("right").addEventListener("click", () => { if (direction !== "LEFT") direction = "RIGHT"; });

// --------------------
// Botões Start/Pause/Reiniciar
// --------------------
document.getElementById("start").addEventListener("click", () => { if (!gameInterval) gameInterval = setInterval(update, speed); });
document.getElementById("pause").addEventListener("click", () => { if (gameInterval) { clearInterval(gameInterval); gameInterval = null; } });
document.getElementById("restart").addEventListener("click", () => {
  if (gameInterval) { clearInterval(gameInterval); gameInterval = null; }
  snake = [
    { x: Math.floor(cols/2) * box, y: Math.floor(rows/2) * box },
    { x: Math.floor(cols/2 - 1) * box, y: Math.floor(rows/2) * box },
    { x: Math.floor(cols/2 - 2) * box, y: Math.floor(rows/2) * box }
  ];
  direction = "RIGHT";
  score = 0;
  speed = 100;
  document.getElementById("score").textContent = score;
  food = randomFoodPosition();
  draw();
});

draw();
