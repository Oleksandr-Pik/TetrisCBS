export const PLAYFIELD_COLUMNS = 10;
export const PLAYFIELD_ROWS = 20;
export const NEXT_TETRO_COLUMNS = 6;
export const NEXT_TETRO_ROWS = 3;
export const TETROMINO_NAMES = ['O', 'L', 'J', 'T', 'S', 'Z', 'I'];
export const TETROMINOES = {
  "O": [
    [1, 1],
    [1, 1],
  ],
  "L": [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  "J": [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  "T": [
    [1, 1, 1],
    [0, 1, 0],
    [0, 0, 0],
  ],
  "S": [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  "Z": [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  "I": [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
};

// let array = [
//   [1,2,3],
//   [4,5,6],
//   [7,8,9],
// ]

export const gameOverBlock = document.querySelector('.game-over');
export const pauseBlock = document.querySelector('.pause');
export const btnResatrt = document.querySelector('.restart');
export const btnReset = document.querySelector('.controls-reset');
export const btnPause = document.querySelector('.controls-pause');
export const btnContinue = document.querySelector('.controls-continue');
export const btnRotate = document.querySelector('.controls-rotate');
export const btnLeft = document.querySelector('.controls-left');
export const btnDown = document.querySelector('.controls-down');
export const btnRight = document.querySelector('.controls-right');
export const btnDropDown = document.querySelector('.controls-dropdown');
