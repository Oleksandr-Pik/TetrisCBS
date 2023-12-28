export const PLAYFIELD_COLUMNS = 10;
export const PLAYFIELD_ROWS = 20;
export const TETROMINO_NAMES = ['O', 'L', 'J', 'T', 'S', 'Z', 'I'];
export const TETROMINOES = {
  O: [
    [1, 1],
    [1, 1],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  T: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 0, 0],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  I: [
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
export const btnResatrt = document.querySelector('.restart');
