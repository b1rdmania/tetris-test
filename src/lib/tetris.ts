// Tetris game logic

export type TetrisShape = number[][];
export type TetrisGrid = number[][];

export interface TetrisState {
  grid: TetrisGrid;
  currentPiece: {
    shape: TetrisShape;
    x: number;
    y: number;
    rotation: number;
  };
  nextPiece: {
    shape: TetrisShape;
    rotation: number;
  };
  score: number;
  level: number;
  lines: number;
  gameOver: boolean;
  isPaused: boolean;
}

// Tetrimino shapes
export const SHAPES = [
  // I shape
  [
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ],
  ],
  // O shape
  [
    [
      [1, 1],
      [1, 1],
    ],
  ],
  // T shape
  [
    [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [0, 1, 0],
    ],
  ],
  // L shape
  [
    [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 1, 1],
      [0, 1, 0],
      [0, 1, 0],
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 1],
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0],
    ],
  ],
  // J shape
  [
    [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [1, 0, 0],
    ],
    [
      [1, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
    ],
  ],
  // S shape
  [
    [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 0, 1],
    ],
    [
      [0, 0, 0],
      [0, 1, 1],
      [1, 1, 0],
    ],
    [
      [1, 0, 0],
      [1, 1, 0],
      [0, 1, 0],
    ],
  ],
  // Z shape
  [
    [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 0, 1],
      [0, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 0, 0],
      [1, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [1, 0, 0],
    ],
  ],
];

// Colors for each shape
export const SHAPE_COLORS = [
  1, // I - cyan
  2, // O - yellow
  3, // T - purple
  4, // L - orange
  5, // J - blue
  6, // S - green
  7, // Z - red
];

// Create a new empty grid
export const createEmptyGrid = (): TetrisGrid => {
  return Array(20)
    .fill(null)
    .map(() => Array(10).fill(0));
};

// Create initial game state
export const createInitialState = (): TetrisState => {
  const shapeIndex = Math.floor(Math.random() * SHAPES.length);
  const nextShapeIndex = Math.floor(Math.random() * SHAPES.length);

  return {
    grid: createEmptyGrid(),
    currentPiece: {
      shape: SHAPES[shapeIndex][0],
      x: 3,
      y: 0,
      rotation: 0,
    },
    nextPiece: {
      shape: SHAPES[nextShapeIndex][0],
      rotation: 0,
    },
    score: 0,
    level: 1,
    lines: 0,
    gameOver: false,
    isPaused: false,
  };
};

// Check if the current piece position is valid
export const isValidPosition = (
  grid: TetrisGrid,
  shape: TetrisShape,
  x: number,
  y: number,
): boolean => {
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col] !== 0) {
        const newX = x + col;
        const newY = y + row;

        // Check boundaries (allow pieces above the top of the grid)
        if (newX < 0 || newX >= grid[0].length || newY >= grid.length) {
          return false;
        }

        // Check collision with existing pieces
        if (newY >= 0 && grid[newY][newX] !== 0) {
          return false;
        }
      }
    }
  }
  return true;
};

// Rotate a piece
export const rotatePiece = (state: TetrisState): TetrisState => {
  const { currentPiece } = state;
  const shapeIndex = SHAPES.findIndex((shapes) =>
    shapes.some(
      (s) => JSON.stringify(s) === JSON.stringify(currentPiece.shape),
    ),
  );

  if (shapeIndex === -1) return state;

  const shapes = SHAPES[shapeIndex];
  const newRotation = (currentPiece.rotation + 1) % shapes.length;
  const newShape = shapes[newRotation];

  // Check if rotation is valid
  if (isValidPosition(state.grid, newShape, currentPiece.x, currentPiece.y)) {
    return {
      ...state,
      currentPiece: {
        ...currentPiece,
        shape: newShape,
        rotation: newRotation,
      },
    };
  }

  // Try wall kicks
  const kicks = [-1, 1, -2, 2];
  for (const kick of kicks) {
    if (
      isValidPosition(
        state.grid,
        newShape,
        currentPiece.x + kick,
        currentPiece.y,
      )
    ) {
      return {
        ...state,
        currentPiece: {
          ...currentPiece,
          shape: newShape,
          rotation: newRotation,
          x: currentPiece.x + kick,
        },
      };
    }
  }

  return state; // Can't rotate
};

// Move piece left
export const movePieceLeft = (state: TetrisState): TetrisState => {
  const { currentPiece, grid } = state;

  if (
    isValidPosition(
      grid,
      currentPiece.shape,
      currentPiece.x - 1,
      currentPiece.y,
    )
  ) {
    return {
      ...state,
      currentPiece: {
        ...currentPiece,
        x: currentPiece.x - 1,
      },
    };
  }

  return state;
};

// Move piece right
export const movePieceRight = (state: TetrisState): TetrisState => {
  const { currentPiece, grid } = state;

  if (
    isValidPosition(
      grid,
      currentPiece.shape,
      currentPiece.x + 1,
      currentPiece.y,
    )
  ) {
    return {
      ...state,
      currentPiece: {
        ...currentPiece,
        x: currentPiece.x + 1,
      },
    };
  }

  return state;
};

// Move piece down
export const movePieceDown = (state: TetrisState): TetrisState => {
  const { currentPiece, grid } = state;

  if (
    isValidPosition(
      grid,
      currentPiece.shape,
      currentPiece.x,
      currentPiece.y + 1,
    )
  ) {
    return {
      ...state,
      currentPiece: {
        ...currentPiece,
        y: currentPiece.y + 1,
      },
    };
  }

  // Piece can't move down, lock it in place
  return lockPiece(state);
};

// Drop piece to bottom
export const dropPiece = (state: TetrisState): TetrisState => {
  let { currentPiece, grid } = state;
  let newY = currentPiece.y;

  while (isValidPosition(grid, currentPiece.shape, currentPiece.x, newY + 1)) {
    newY++;
  }

  if (newY !== currentPiece.y) {
    return {
      ...state,
      currentPiece: {
        ...currentPiece,
        y: newY,
      },
    };
  }

  return lockPiece(state);
};

// Lock the current piece in place and spawn a new one
export const lockPiece = (state: TetrisState): TetrisState => {
  const { currentPiece, grid, nextPiece, score, level, lines } = state;
  const newGrid = [...grid.map((row) => [...row])];
  const shapeIndex = SHAPES.findIndex((shapes) =>
    shapes.some((s) => JSON.stringify(s) === JSON.stringify(nextPiece.shape)),
  );

  // Add current piece to grid
  for (let row = 0; row < currentPiece.shape.length; row++) {
    for (let col = 0; col < currentPiece.shape[row].length; col++) {
      if (currentPiece.shape[row][col] !== 0) {
        const gridRow = currentPiece.y + row;
        const gridCol = currentPiece.x + col;

        if (
          gridRow >= 0 &&
          gridRow < newGrid.length &&
          gridCol >= 0 &&
          gridCol < newGrid[0].length
        ) {
          // Use the shape color index + 1 (0 is empty)
          const colorIndex = SHAPES.findIndex((shapes) =>
            shapes.some(
              (s) => JSON.stringify(s) === JSON.stringify(currentPiece.shape),
            ),
          );
          newGrid[gridRow][gridCol] = colorIndex + 1;
        }
      }
    }
  }

  // Check for completed lines
  const completedLines = [];
  for (let row = 0; row < newGrid.length; row++) {
    if (newGrid[row].every((cell) => cell !== 0)) {
      completedLines.push(row);
    }
  }

  // Remove completed lines
  for (const row of completedLines) {
    newGrid.splice(row, 1);
    newGrid.unshift(Array(10).fill(0));
  }

  // Calculate score
  const linesCleared = completedLines.length;
  const newLines = lines + linesCleared;
  const newLevel = Math.floor(newLines / 10) + 1;
  let newScore = score;

  switch (linesCleared) {
    case 1:
      newScore += 40 * level;
      break;
    case 2:
      newScore += 100 * level;
      break;
    case 3:
      newScore += 300 * level;
      break;
    case 4:
      newScore += 1200 * level;
      break;
  }

  // Generate next piece
  const nextShapeIndex = Math.floor(Math.random() * SHAPES.length);

  // Check if game over
  const newPiece = {
    shape: SHAPES[shapeIndex][0],
    x: 3,
    y: 0,
    rotation: 0,
  };

  const gameOver = !isValidPosition(
    newGrid,
    newPiece.shape,
    newPiece.x,
    newPiece.y,
  );

  return {
    ...state,
    grid: newGrid,
    currentPiece: newPiece,
    nextPiece: {
      shape: SHAPES[nextShapeIndex][0],
      rotation: 0,
    },
    score: newScore,
    level: newLevel,
    lines: newLines,
    gameOver,
  };
};

// Toggle pause state
export const togglePause = (state: TetrisState): TetrisState => {
  return {
    ...state,
    isPaused: !state.isPaused,
  };
};

// Reset game
export const resetGame = (): TetrisState => {
  return createInitialState();
};
