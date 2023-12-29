import {
  PLAYFIELD_COLUMNS,
  PLAYFIELD_ROWS,
  TETROMINO_NAMES,
  TETROMINOES,
  gameOverBlock,
  btnResatrt,
  btnReset,
  btnRotate,
  btnLeft,
  btnDown,
  btnRight,
  btnDropDown
} from './utils.js';

let playfield,
  tetromino,
  intervalId,
  requestId,
  cells,
  score,
  highScore,
  isPaused = false,
  isGameOver = false;

initGame();

function initGame() {
  gameOverBlock.style.display = 'none';
  isGameOver = false;
  generatePlayfield();
  generateTetromino();
  startLoop();
  cells = document.querySelectorAll('.tetris div');
  score = 0;
  highScore = localStorage.getItem('highScore') || 0
  updateScore();
}

// Keydown events

document.addEventListener('keydown', onKeyDown);
btnResatrt.addEventListener('click', () => initGame());
btnReset.addEventListener('click', () => initGame());
btnRotate.addEventListener('click', () => rotateTetromino());
btnLeft.addEventListener('click', () => moveTetrominoLeft());
btnDown.addEventListener('click', () => moveTetrominoDown());
btnRight.addEventListener('click', () => moveTetrominoRight());
btnDropDown.addEventListener('click', () => dropTetrominoDown());

function togglePauseGame() {
  isPaused = !isPaused;

  if (isPaused) {
    stopLoop();
  } else {
    startLoop();
  }
}

function onKeyDown(event) {
  if (event.key == 'p') {
    togglePauseGame();
  }
  if (isPaused) {
    return;
  }
  switch (event.key) {
    case ' ':
      dropTetrominoDown();
      break;
    case 'ArrowUp':
      rotateTetromino();
      break;
    case 'ArrowDown':
      moveTetrominoDown();
      break;
    case 'ArrowLeft':
      moveTetrominoLeft();
      break;
    case 'ArrowRight':
      moveTetrominoRight();
      break;
  }
  draw();
}

function dropTetrominoDown() {
  while (!isValid()) {
    tetromino.row++;
  }
  tetromino.row--;
}

function moveTetrominoDown() {
  tetromino.row += 1;
  if (isValid()) {
    tetromino.row -= 1;
    placeTetromino();
  }
}

function moveTetrominoLeft() {
  tetromino.column -= 1;
  if (isValid()) {
    tetromino.column += 1;
  }
}

function moveTetrominoRight() {
  tetromino.column += 1;
  if (isValid()) {
    tetromino.column -= 1;
  }
}

// Functions generate playfilds and tetromino

function generatePlayfield() {
  document.querySelector('.tetris').innerHTML = '';
  for (let i = 0; i < PLAYFIELD_ROWS * PLAYFIELD_COLUMNS; i++) {
    const div = document.createElement('div');
    document.querySelector('.tetris').append(div);
  }

  playfield = new Array(PLAYFIELD_ROWS)
    .fill()
    .map(() => new Array(PLAYFIELD_COLUMNS).fill(0));
}

function generateTetromino() {
  const randomIndex = Math.floor(Math.random() * (6 + 1));

  const nameTetro = TETROMINO_NAMES[randomIndex];
  const matrixTetro = TETROMINOES[nameTetro];

  const columnTetro =
    PLAYFIELD_COLUMNS / 2 - Math.floor(matrixTetro.length / 2);
  const rowTetro = -2;

  tetromino = {
    name: nameTetro,
    matrix: matrixTetro,
    row: rowTetro,
    column: columnTetro,
    index: randomIndex,
  };
}

function convertPositionIndex(row, column) {
  return row * PLAYFIELD_COLUMNS + column;
}

// Draw

function drawPlayField() {
  for (let row = 0; row < PLAYFIELD_ROWS; row++) {
    for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
      const name = playfield[row][column];
      const cellIndex = convertPositionIndex(row, column);
      cells[cellIndex].classList.add(name);
    }
  }
}

function drawTetromino() {
  const name = tetromino.name;
  const tetrominoMatrixSize = tetromino.matrix.length;

  for (let row = 0; row < tetrominoMatrixSize; row++) {
    for (let column = 0; column < tetrominoMatrixSize; column++) {
      if (isOutsideTopBoard(row)) {
        continue;
      }
      if (!tetromino.matrix[row][column]) {
        continue;
      }
      const cellIndex = convertPositionIndex(
        tetromino.row + row,
        tetromino.column + column
      );
      cells[cellIndex].classList.add(name);
    }
  }
}

function draw() {
  cells.forEach(function (cell) {
    cell.removeAttribute('class');
  });
  drawPlayField();
  drawTetromino();
}

function calculateScore(filledRows) {
  switch (filledRows.length) {
    case 1:
      return 10;
    case 2:
      return 30;
    case 3:
      return 50;
    case 4:
      return 100;
    default:
      return 0;
  }
}

function updateScore() {
  document.querySelector('.js-score').textContent = score;
  document.querySelector('.js-high-score').textContent = highScore;
}

function gameOver() {
  stopLoop();
  if(score>highScore){
    highScore = score;
    localStorage.setItem('highScore', highScore);
  }
  gameOverBlock.style.display = 'flex';
}

function isOutsideTopBoard(row) {
  return tetromino.row + row < 0;
}

function placeTetromino() {
  const matrixSize = tetromino.matrix.length;
  for (let row = 0; row < matrixSize; row++) {
    for (let column = 0; column < matrixSize; column++) {
      if (!tetromino.matrix[row][column]) continue;
      if (isOutsideTopBoard(row)) {
        isGameOver = true;
        return;
      }
      playfield[tetromino.row + row][tetromino.column + column] =
        tetromino.name;
    }
  }
  const filledRows = findFilledRows();
  removeFilledRows(filledRows);
  generateTetromino();
}

function removeFilledRows(filledRows) {
  if (filledRows.length > 0) {
    score += calculateScore(filledRows);
    updateScore();
  }
  filledRows.forEach(row => {
    dropRowsAbove(row);
  });
}

function dropRowsAbove(rowDelete) {
  for (let row = rowDelete; row > 0; row--) {
    playfield[row] = playfield[row - 1];
  }
  playfield[0] = new Array(PLAYFIELD_COLUMNS).fill(0);
}

function findFilledRows() {
  const filledRows = [];
  for (let row = 0; row < PLAYFIELD_ROWS; row++) {
    let filledColumns = 0;
    for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
      if (playfield[row][column] != 0) {
        filledColumns++;
      }
    }
    if (PLAYFIELD_COLUMNS === filledColumns) {
      filledRows.push(row);
    }
  }
  return filledRows;
}

function rotateTetromino() {
  const oldMatrix = tetromino.matrix;
  const rotatedMatrix = rotateMatrix(tetromino.matrix);
  tetromino.matrix = rotatedMatrix;
  if (isValid()) {
    tetromino.matrix = oldMatrix;
  }
}

function rotateMatrix(matrixTetromino) {
  const N = matrixTetromino.length;
  const rotateMatrix = [];
  for (let i = 0; i < N; i++) {
    rotateMatrix[i] = [];
    for (let j = 0; j < N; j++) {
      rotateMatrix[i][j] = matrixTetromino[N - j - 1][i];
    }
  }
  return rotateMatrix;
}

function isValid() {
  const matrixSize = tetromino.matrix.length;
  for (let row = 0; row < matrixSize; row++) {
    for (let column = 0; column < matrixSize; column++) {
      if (!tetromino.matrix[row][column]) {
        continue;
      }
      if (isOutsideOfGameBoard(row, column)) {
        return true;
      }
      if (hasCollisions(row, column)) {
        return true;
      }
    }
  }
  return false;
}

function isOutsideOfGameBoard(row, column) {
  return (
    tetromino.column + column < 0 ||
    tetromino.column + column >= PLAYFIELD_COLUMNS ||
    tetromino.row + row >= PLAYFIELD_ROWS
  );
}

function hasCollisions(row, column) {
  return playfield[tetromino.row + row]?.[tetromino.column + column];
}

function startLoop() {
  intervalId = setInterval(() => {
    requestId = requestAnimationFrame(moveDown);
  }, 700);
}

function moveDown() {
  moveTetrominoDown();
  draw();
  stopLoop();
  startLoop();
  if (isGameOver) {
    gameOver();
  }
}

function stopLoop() {
  cancelAnimationFrame(requestId);
  clearInterval(intervalId);
}
