// Worm Game JavaScript
// Get canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const restartBtn = document.getElementById("restartBtn");
// Size of each grid cell
const gridSize = 20;
// Cell spacing for visual separation
const cellSpacing = 2;
// Animation frame ID for cleanup
let animationId = null;
// Initial worm segments (array of {x, y})
let worm = [
  { x: 8, y: 10 },
  { x: 7, y: 10 },
  { x: 6, y: 10 },
];
// Current and next direction of movement
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
// Input buffer for handling rapid key presses
let inputBuffer = [];
// Food position
let food = randomFood();
// Whether the worm should grow this turn
let grow = false;
// Player's score
let score = 0;
// Game over flag
let gameOver = false;

// Generate a random food position not on the worm
function randomFood() {
  let x, y, collision;
  do {
    x = Math.floor(Math.random() * (canvas.width / gridSize));
    y = Math.floor(Math.random() * (canvas.height / gridSize));
    collision = worm.some((seg) => seg.x === x && seg.y === y);
  } while (collision);
  return { x, y };
}

// Draw everything: worm, food, and score
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw food (red square)
  ctx.fillStyle = "#f00";
  ctx.fillRect(
    food.x * gridSize,
    food.y * gridSize,
    gridSize - cellSpacing,
    gridSize - cellSpacing
  );
  // Draw worm (green squares)
  ctx.fillStyle = "#0f0";
  for (const segment of worm) {
    ctx.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize - cellSpacing,
      gridSize - cellSpacing
    );
  }
  // Draw score (top left)
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.textAlign = "left";
  ctx.fillText("Score: " + score, 10, 30);
}

// Move the worm, check for collisions and food
function moveWorm() {
  // Process input buffer
  if (inputBuffer.length > 0) {
    const bufferedDirection = inputBuffer.shift();
    if (isValidDirectionChange(bufferedDirection)) {
      nextDirection = bufferedDirection;
    }
  }
  direction = { ...nextDirection };
  // Calculate new head position
  const head = { x: worm[0].x + direction.x, y: worm[0].y + direction.y };
  // Check wall collision
  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= canvas.width / gridSize ||
    head.y >= canvas.height / gridSize
  ) {
    gameOver = true;
    return;
  }
  // Check self collision
  if (worm.some((seg) => seg.x === head.x && seg.y === head.y)) {
    gameOver = true;
    return;
  }
  // Add new head
  worm.unshift(head);
  // Check if worm eats food
  if (head.x === food.x && head.y === food.y) {
    grow = true;
    food = randomFood();
    score++;
  }
  // Remove tail unless growing
  if (!grow) {
    worm.pop();
  } else {
    grow = false;
  }
}

// Check if direction change is valid (not reversing)
function isValidDirectionChange(newDir) {
  return !(
    (direction.x !== 0 && newDir.x !== 0) ||
    (direction.y !== 0 && newDir.y !== 0)
  );
}

// Reset game state
function resetGame() {
  worm = [
    { x: 8, y: 10 },
    { x: 7, y: 10 },
    { x: 6, y: 10 },
  ];
  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  inputBuffer = [];
  food = randomFood();
  grow = false;
  score = 0;
  gameOver = false;
  restartBtn.style.display = "none";
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  gameLoop();
}

// Main game loop: move, draw, and handle game over
function gameLoop() {
  if (gameOver) {
    // Draw game over overlay
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
    ctx.font = "24px Arial";
    ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2 + 40);
    restartBtn.style.display = "block";
    return;
  }
  moveWorm();
  drawGame();
  // Schedule next frame (approximately 100ms = 10 FPS)
  animationId = setTimeout(() => requestAnimationFrame(gameLoop), 100);
}

// Handle keyboard input for direction, prevent arrow key scrolling
// Buffer input to handle rapid key presses between game ticks
document.addEventListener("keydown", (e) => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault();
  }
  let newDirection = null;
  switch (e.key) {
    case "ArrowUp":
      newDirection = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      newDirection = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      newDirection = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      newDirection = { x: 1, y: 0 };
      break;
  }
  // Add to buffer if valid and buffer not full
  if (newDirection && inputBuffer.length < 3) {
    inputBuffer.push(newDirection);
  }
});

// Restart button event listener
restartBtn.addEventListener("click", resetGame);

// Start the game loop and initial draw
gameLoop();
