import {
  PLAYFIELD_COLUMNS,
  PLAYFIELD_ROWS,
  NEXT_TETRO_COLUMNS,
  NEXT_TETRO_ROWS,
  TETROMINO_NAMES,
  TETROMINOES,
  gameOverBlock,
  btnResatrt,
  btnReset,
  btnRotate,
  btnLeft,
  btnDown,
  btnRight,
  btnDropDown,
} from './utils.js';

const startAudio = new Audio("./sounds/startGame.mp3");
const gameOverAudio = new Audio("./sounds/gameOver.mp3");
const rotateAudio = new Audio("./sounds/rotate.mp3");
const moveAudio = new Audio("./sounds/move.mp3");
const putAudio = new Audio("./sounds/put.mp3");
const deleteAudio = new Audio("./sounds/delete.mp3");

let playfield,
  nexTetroField,
  tetromino,
  nextTetromino,
  intervalId,
  requestId,
  cells,
  cellsNext,
  score,
  highScore,
  isPaused = false,
  isGameOver = false;

document.addEventListener('contextmenu', e => {
  e.preventDefault();
});

document.addEventListener('keydown', e => {
  if (e.key === ' ') {
    e.preventDefault();
  }
});

// startAudio.play();

initGame();

function initGame() {
  startAudio.play();
  gameOverBlock.style.display = 'none';
  isGameOver = false;
  isPaused = false;
  stopLoop();
  generatePlayfield();
  generateTetromino(true);
  generateNextField();

  cells = document.querySelectorAll('.tetris div');
  cellsNext = document.querySelectorAll('.nextTetro div');
  score = 0;
  highScore = localStorage.getItem('highScore') || 0;
  updateScore();
  drawTetrominoNext();
  startLoop();
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
  // console.log('event.key', event.key)
  // console.log('event.code', event.code)
  if (event.code == 'KeyP') {
    togglePauseGame();
  }
  if (isPaused) {
    return;
  }
  switch (event.code) {
    case 'Space':
      putAudio.play();
      dropTetrominoDown();
      break;
    case 'ArrowUp':
      rotateAudio.play();
      rotateTetromino();
      break;
    case 'ArrowDown':
      moveAudio.play();
      moveTetrominoDown();
      break;
    case 'ArrowLeft':
      moveAudio.play();
      moveTetrominoLeft();
      break;
    case 'ArrowRight':
      moveAudio.play();
      moveTetrominoRight();
      break;
  }
  draw();
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
  } else {
    calculateGhostPosition();
  }
}

function moveTetrominoRight() {
  tetromino.column += 1;
  if (isValid()) {
    tetromino.column -= 1;
  } else {
    calculateGhostPosition();
  }
}

function dropTetrominoDown() {
  while (!isValid()) {
    tetromino.row++;
  }
  tetromino.row--;
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

function generateNextField() {
  document.querySelector('.nextTetro').innerHTML = '';
  for (let i = 0; i < NEXT_TETRO_COLUMNS * NEXT_TETRO_ROWS; i++) {
    const div = document.createElement('div');
    document.querySelector('.nextTetro').append(div);
  }

  nexTetroField = new Array(NEXT_TETRO_ROWS)
    .fill()
    .map(() => new Array(NEXT_TETRO_COLUMNS).fill(0));
}

function generateTetromino(isFirst) {
  const nameTetro = getRandomElement(TETROMINO_NAMES);
  const matrixTetro = TETROMINOES[nameTetro];

  const nameNextTetro = getRandomElement(TETROMINO_NAMES);
  const matrixNextTetro = TETROMINOES[nameNextTetro];

  const rowTetro = -2;
  const columnTetro = Math.floor(
    PLAYFIELD_COLUMNS / 2 - matrixTetro.length / 2
  );
  const columnNextTetro = Math.floor(
    PLAYFIELD_COLUMNS / 2 - matrixNextTetro.length / 2
  );

  tetromino = {
    name: nameTetro,
    matrix: matrixTetro,
    row: rowTetro,
    column: columnTetro,
    // index: randomIndex,
    ghostRow: rowTetro,
    ghostColumn: columnTetro,
  };

  tetromino = isFirst ? tetromino : nextTetromino;

  nextTetromino = {
    name: nameNextTetro,
    matrix: matrixNextTetro,
    row: rowTetro,
    column: columnNextTetro,
    ghostRow: rowTetro,
    ghostColumn: columnTetro,
  };
}

function getRandomElement(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

// function convertPositionIndex(row, column) {
//   return row * PLAYFIELD_COLUMNS + column;
// }

function convertPositionIndex(row, column, columnValue) {
  return row * columnValue + column;
}

// Draw

function drawPlayField(field, cells, numRows, numColumns) {
  for (let row = 0; row < numRows; row++) {
    for (let column = 0; column < numColumns; column++) {
      const name = field[row][column];
      const cellIndex = convertPositionIndex(row, column, numColumns);
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
      if (tetromino.matrix[row][column] == 0) {
        continue;
      }
      const cellIndex = convertPositionIndex(
        tetromino.row + row,
        tetromino.column + column,
        PLAYFIELD_COLUMNS
      );
      cells[cellIndex].classList.add(name);
    }
  }
}

function drawTetrominoNext() {
  let extraRow = 0;
  let extraColumn = 1;
  const name = nextTetromino.name;
  const tetrominoMatrixSize = nextTetromino.matrix.length;
  for (let row = 0; row < tetrominoMatrixSize; row++) {
    for (let column = 0; column < tetrominoMatrixSize; column++) {
      if (nextTetromino.matrix[row][column] == 0) {
        continue;
      }
      const cellIndex = convertPositionIndex(
        row + extraRow,
        column + extraColumn,
        NEXT_TETRO_COLUMNS
      );
      cellsNext[cellIndex].classList.add(name);
    }
  }
}

function drawGhostTetromino() {
  const tetrominoMatrixSize = tetromino.matrix.length;
  for (let row = 0; row < tetrominoMatrixSize; row++) {
    for (let column = 0; column < tetrominoMatrixSize; column++) {
      if (!tetromino.matrix[row][column]) continue;
      if (tetromino.ghostRow + row < 0) continue;
      const cellIndex = convertPositionIndex(
        tetromino.ghostRow + row,
        tetromino.ghostColumn + column,
        PLAYFIELD_COLUMNS
      );
      cells[cellIndex].classList.add('ghost');
    }
  }
}

function draw() {
  cells.forEach(function (cell) {
    cell.removeAttribute('class');
  });
  drawPlayField(playfield, cells, PLAYFIELD_ROWS, PLAYFIELD_COLUMNS);
  drawTetromino();
  drawTetrominoNext();
  drawGhostTetromino();
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
  gameOverAudio.play();
  stopLoop();
  if (score > highScore) {
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
  // generateTetromino();
  generateTetromino(false);
  cellsNext.forEach(function (cell) {
    cell.removeAttribute('class');
  });
  drawPlayField(nexTetroField, cellsNext, NEXT_TETRO_ROWS, NEXT_TETRO_COLUMNS);
  drawTetrominoNext();
}

function removeFilledRows(filledRows) {
  if (filledRows.length > 0) {
    deleteAudio.play();
    score += calculateScore(filledRows);
    updateScore();
  }
  filledRows.forEach(row => {
    dropRowsAbove(row);
  // cells[row].classList.add("deleted");
  });
}

function dropRowsAbove(rowDelete) {
  for (let row = rowDelete; row > 0; row--) {
    playfield[row] = playfield[row - 1];
  }
  playfield[0] = new Array(PLAYFIELD_COLUMNS).fill(0);
}

function calculateGhostPosition() {
  const tetrominoRow = tetromino.row;
  tetromino.row++;
  while (!isValid()) {
    tetromino.row++;
    console.log('tetromino.ghostRow', tetromino.row);
    console.log('isValid', isValid());
  }
  tetromino.ghostRow = tetromino.row - 1;
  tetromino.ghostColumn = tetromino.column;
  tetromino.row = tetrominoRow;
  console.log('tetromino.ghostColumn', tetromino.ghostColumn);
  console.log('tetromino.ghostRow', tetromino.ghostRow);
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
  } else {
    calculateGhostPosition();
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
