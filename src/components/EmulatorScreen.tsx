import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { useAudio } from "@/lib/useAudio";
import {
  createInitialState,
  movePieceLeft,
  movePieceRight,
  movePieceDown,
  rotatePiece,
  dropPiece,
  togglePause,
  resetGame,
  TetrisState,
  SHAPES,
} from "@/lib/tetris";

interface EmulatorScreenProps {
  isGameRunning?: boolean;
  colorPalette?: "classic" | "blackwhite" | "blue" | "red";
  onGameOver?: () => void;
  onScoreUpdate?: (score: number) => void;
  onButtonPress?: (button: string) => void;
  soundEnabled?: boolean;
  volume?: number;
}

const BLOCK_COLORS = [
  "bg-transparent", // Empty
  "bg-cyan-500", // I
  "bg-yellow-400", // O
  "bg-purple-500", // T
  "bg-orange-500", // L
  "bg-blue-500", // J
  "bg-green-500", // S
  "bg-red-500", // Z
];

const EmulatorScreen = ({
  isGameRunning = false,
  colorPalette = "classic",
  onGameOver = () => {},
  onScoreUpdate = () => {},
  onButtonPress = () => {},
  soundEnabled = true,
  volume = 80,
}: EmulatorScreenProps) => {
  const [gameState, setGameState] = useState<
    "title" | "playing" | "paused" | "gameover"
  >("title");
  const [tetrisState, setTetrisState] =
    useState<TetrisState>(createInitialState());
  const gameLoopRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const dropIntervalRef = useRef<number>(1000); // Initial drop interval in ms

  const {
    play: playMusic,
    pause: pauseMusic,
    setVolume: setMusicVolume,
  } = useAudio("/tetris.mp3", {
    loop: true,
    volume: volume / 100,
  });

  // Color palette configurations
  const palettes = {
    classic: {
      background: "bg-[#9bbc0f]",
      foreground: "text-[#0f380f]",
      border: "border-[#0f380f]",
      blockColor: "bg-[#0f380f]",
      screenBg: "bg-[#8bac0f]",
    },
    blackwhite: {
      background: "bg-[#e0e0e0]",
      foreground: "text-black",
      border: "border-black",
      blockColor: "bg-black",
      screenBg: "bg-[#c0c0c0]",
    },
    blue: {
      background: "bg-[#8ba5ff]",
      foreground: "text-[#00238b]",
      border: "border-[#00238b]",
      blockColor: "bg-[#00238b]",
      screenBg: "bg-[#7b95ef]",
    },
    red: {
      background: "bg-[#ff9b9b]",
      foreground: "text-[#8b0000]",
      border: "border-[#8b0000]",
      blockColor: "bg-[#8b0000]",
      screenBg: "bg-[#ef7b7b]",
    },
  };

  const currentPalette = palettes[colorPalette];

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing") return;

      switch (e.key) {
        case "ArrowLeft":
          setTetrisState((prevState) => movePieceLeft(prevState));
          break;
        case "ArrowRight":
          setTetrisState((prevState) => movePieceRight(prevState));
          break;
        case "ArrowDown":
          setTetrisState((prevState) => movePieceDown(prevState));
          break;
        case "ArrowUp":
        case "z":
          setTetrisState((prevState) => rotatePiece(prevState));
          break;
        case " ":
          setTetrisState((prevState) => dropPiece(prevState));
          break;
        case "p":
          toggleGamePause();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  // Handle button presses from controller
  const handleButtonPress = useCallback(
    (button: string) => {
      if (gameState === "title") {
        if (button === "start") {
          startGame();
        }
      } else if (gameState === "playing") {
        switch (button) {
          case "left":
            setTetrisState((prevState) => movePieceLeft(prevState));
            break;
          case "right":
            setTetrisState((prevState) => movePieceRight(prevState));
            break;
          case "down":
            setTetrisState((prevState) => movePieceDown(prevState));
            break;
          case "up":
          case "a":
            setTetrisState((prevState) => rotatePiece(prevState));
            break;
          case "b":
            setTetrisState((prevState) => dropPiece(prevState));
            break;
          case "start":
            toggleGamePause();
            break;
        }
      } else if (gameState === "paused") {
        if (button === "start") {
          toggleGamePause();
        }
      } else if (gameState === "gameover") {
        if (button === "start") {
          startGame();
        }
      }

      onButtonPress(button);
    },
    [gameState, onButtonPress],
  );

  // Update drop interval based on level
  useEffect(() => {
    dropIntervalRef.current = Math.max(
      100,
      1000 - (tetrisState.level - 1) * 100,
    );
  }, [tetrisState.level]);

  // Game loop
  const gameLoop = useCallback(
    (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = timestamp - lastTimeRef.current;

      if (deltaTime > dropIntervalRef.current) {
        setTetrisState((prevState) => {
          const newState = movePieceDown(prevState);
          if (newState.gameOver) {
            setGameState("gameover");
            pauseMusic();
            onGameOver();
          }
          return newState;
        });
        lastTimeRef.current = timestamp;
      }

      if (gameState === "playing") {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
      }
    },
    [gameState, onGameOver, pauseMusic],
  );

  // Start/stop game loop based on game state
  useEffect(() => {
    if (gameState === "playing") {
      if (gameLoopRef.current === null) {
        lastTimeRef.current = 0;
        gameLoopRef.current = requestAnimationFrame(gameLoop);
      }
      if (soundEnabled) {
        playMusic();
      }
    } else {
      if (gameLoopRef.current !== null) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      if (gameState !== "paused") {
        pauseMusic();
      }
    }

    return () => {
      if (gameLoopRef.current !== null) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [gameState, gameLoop, playMusic, pauseMusic, soundEnabled]);

  // Update score
  useEffect(() => {
    onScoreUpdate(tetrisState.score);
  }, [tetrisState.score, onScoreUpdate]);

  // Update volume
  useEffect(() => {
    setMusicVolume(volume);
  }, [volume, setMusicVolume]);

  // Start game
  const startGame = () => {
    setTetrisState(resetGame());
    setGameState("playing");
  };

  // Toggle pause
  const toggleGamePause = () => {
    if (gameState === "playing") {
      setGameState("paused");
      pauseMusic();
    } else if (gameState === "paused") {
      setGameState("playing");
      if (soundEnabled) {
        playMusic();
      }
    }
  };

  // Effect to handle isGameRunning prop
  useEffect(() => {
    if (isGameRunning && gameState === "title") {
      startGame();
    }
  }, [isGameRunning, gameState]);

  // Render the title screen
  const renderTitleScreen = () => (
    <div
      className={`flex flex-col items-center justify-center h-full ${currentPalette.foreground}`}
    >
      <h1 className="text-2xl font-bold mb-4">TETRIS</h1>
      <div className="text-sm mb-2">© 1989 Nintendo</div>
      <div className="text-sm mb-4">by birdmania</div>
      <div className="animate-pulse text-sm">PRESS START</div>
    </div>
  );

  // Render the game over screen
  const renderGameOverScreen = () => (
    <div
      className={`flex flex-col items-center justify-center h-full ${currentPalette.foreground}`}
    >
      <h1 className="text-2xl font-bold mb-4">GAME OVER</h1>
      <div className="text-sm mb-2">SCORE: {tetrisState.score}</div>
      <div className="text-sm mb-6">LINES: {tetrisState.lines}</div>
      <div className="animate-pulse text-sm">PRESS START TO PLAY AGAIN</div>
    </div>
  );

  // Render the paused screen
  const renderPausedScreen = () => (
    <div
      className={`flex flex-col items-center justify-center h-full ${currentPalette.foreground}`}
    >
      <h1 className="text-2xl font-bold mb-4">PAUSED</h1>
      <div className="animate-pulse text-sm">PRESS START TO CONTINUE</div>
    </div>
  );

  // Get block color based on value and palette
  const getBlockColor = (value: number) => {
    if (value === 0) return "bg-transparent";

    if (colorPalette === "classic") {
      return currentPalette.blockColor;
    } else {
      return BLOCK_COLORS[value];
    }
  };

  // Render the game grid
  const renderGameGrid = () => {
    const { grid, currentPiece, nextPiece, score, level, lines } = tetrisState;

    // Create a display grid that includes the current piece
    const displayGrid = grid.map((row) => [...row]);

    // Add current piece to display grid
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x] !== 0) {
          const gridY = currentPiece.y + y;
          const gridX = currentPiece.x + x;

          if (
            gridY >= 0 &&
            gridY < displayGrid.length &&
            gridX >= 0 &&
            gridX < displayGrid[0].length
          ) {
            // Find the shape index for coloring
            const shapeIndex = SHAPES.findIndex((shapes) =>
              shapes.some(
                (s) => JSON.stringify(s) === JSON.stringify(currentPiece.shape),
              ),
            );
            displayGrid[gridY][gridX] = shapeIndex + 1;
          }
        }
      }
    }

    return (
      <div className="flex flex-col items-center justify-between h-full py-2">
        {/* Score display */}
        <div
          className={`w-full flex justify-between px-4 ${currentPalette.foreground} text-xs`}
        >
          <div>
            <div>SCORE</div>
            <div>{score.toString().padStart(6, "0")}</div>
          </div>
          <div>
            <div>LEVEL</div>
            <div>{level}</div>
          </div>
          <div>
            <div>LINES</div>
            <div>{lines}</div>
          </div>
        </div>

        {/* Game grid */}
        <div className={`border ${currentPalette.border} p-1 mt-2`}>
          <div className="grid grid-cols-10 gap-px">
            {displayGrid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-4 h-4 ${getBlockColor(cell)}`}
                />
              )),
            )}
          </div>
        </div>

        {/* Next piece preview */}
        <div
          className={`w-full flex justify-between px-4 ${currentPalette.foreground} text-xs mt-2`}
        >
          <div>
            <div>NEXT</div>
            <div className="border border-current p-1 mt-1 w-16 h-12 flex items-center justify-center">
              <div className="grid grid-cols-4 gap-px">
                {Array(16)
                  .fill(0)
                  .map((_, i) => {
                    const row = Math.floor(i / 4);
                    const col = i % 4;
                    const shapeIndex = SHAPES.findIndex((shapes) =>
                      shapes.some(
                        (s) =>
                          JSON.stringify(s) === JSON.stringify(nextPiece.shape),
                      ),
                    );
                    const shape = nextPiece.shape;

                    // Center the shape in the preview
                    const offsetX = Math.floor((4 - shape[0].length) / 2);
                    const offsetY = Math.floor((4 - shape.length) / 2);

                    const isShapeCell =
                      row >= offsetY &&
                      row < offsetY + shape.length &&
                      col >= offsetX &&
                      col < offsetX + shape[0].length &&
                      shape[row - offsetY][col - offsetX] === 1;

                    return (
                      <div
                        key={i}
                        className={`w-2 h-2 ${isShapeCell ? getBlockColor(shapeIndex + 1) : "bg-transparent"}`}
                      />
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      <Card
        className={`w-[240px] h-[216px] ${currentPalette.screenBg} overflow-hidden p-2 shadow-inner`}
      >
        {gameState === "title" && renderTitleScreen()}
        {gameState === "playing" && renderGameGrid()}
        {gameState === "paused" && renderPausedScreen()}
        {gameState === "gameover" && renderGameOverScreen()}
      </Card>
    </div>
  );
};

export default EmulatorScreen;
