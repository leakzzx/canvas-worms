// Worm Game JavaScript
// Get canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
// Size of each grid cell
const gridSize = 20;
// Initial worm segments (array of {x, y})
let worm = [
  { x: 8, y: 10 },
  { x: 7, y: 10 },
  { x: 6, y: 10 },
];
// Current and next direction of movement
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
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
function drawWorm() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw food (red square)
  ctx.fillStyle = "#f00";
  ctx.fillRect(
    food.x * gridSize,
    food.y * gridSize,
    gridSize - 2,
    gridSize - 2
  );
  // Draw worm (green squares)
  ctx.fillStyle = "#0f0";
  for (const segment of worm) {
    ctx.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize - 2,
      gridSize - 2
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
    return;
  }
  moveWorm();
  drawWorm();
}

// Handle keyboard input for direction, prevent arrow key scrolling
// Only allow direction change if not reversing
// Arrow keys: Up, Down, Left, Right
// Prevent default browser scroll
// ...existing code...
document.addEventListener("keydown", (e) => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault();
  }
  switch (e.key) {
    case "ArrowUp":
      if (direction.y !== 1) nextDirection = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (direction.y !== -1) nextDirection = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (direction.x !== 1) nextDirection = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (direction.x !== -1) nextDirection = { x: 1, y: 0 };
      break;
  }
});

// Start the game loop
setInterval(gameLoop, 100);
// Initial draw
drawWorm();
