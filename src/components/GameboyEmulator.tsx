import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import EmulatorScreen from "./EmulatorScreen";
import EmulatorControls from "./EmulatorControls";

interface GameboyEmulatorProps {
  onButtonPress?: (button: string) => void;
  isGameRunning?: boolean;
  colorPalette?: "classic" | "blackwhite" | "blue" | "red";
  screenSize?: number;
  soundEnabled?: boolean;
  volume?: number;
}

const GameboyEmulator = ({
  onButtonPress = () => {},
  isGameRunning = false,
  colorPalette = "classic",
  screenSize = 100,
  soundEnabled = true,
  volume = 50,
}: GameboyEmulatorProps) => {
  const [isPoweredOn, setIsPoweredOn] = useState(true);
  const [gameRunning, setGameRunning] = useState(isGameRunning);
  const [score, setScore] = useState(0);

  const handleButtonPress = useCallback(
    (button: "a" | "b" | "start" | "select") => {
      if (!isPoweredOn) return;

      if (button === "start") {
        setGameRunning(true);
      }

      onButtonPress(button);
    },
    [isPoweredOn, onButtonPress],
  );

  const handleDirectionPress = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      if (!isPoweredOn) return;
      onButtonPress(direction);
    },
    [isPoweredOn, onButtonPress],
  );

  const togglePower = () => {
    setIsPoweredOn(!isPoweredOn);
    if (!isPoweredOn) {
      setGameRunning(false);
    }
  };

  const handleGameOver = useCallback(() => {
    setGameRunning(false);
  }, []);

  const handleScoreUpdate = useCallback((newScore: number) => {
    setScore(newScore);
  }, []);

  // Update game running state when prop changes
  useEffect(() => {
    setGameRunning(isGameRunning);
  }, [isGameRunning]);

  // Scale factor based on screen size
  const scaleFactor = screenSize / 100;

  return (
    <div className="flex flex-col items-center justify-center w-full bg-gray-100">
      <Card
        className="relative bg-[#e0e0c0] rounded-[20px] shadow-xl border-4 border-[#a0a088] overflow-visible flex flex-col items-center pt-8 pb-6 px-6"
        style={{
          width: `${400 * scaleFactor}px`,
          height: `${650 * scaleFactor}px`,
          transform: `scale(${scaleFactor})`,
          transformOrigin: "top center",
        }}
      >
        {/* GameBoy Logo */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center">
          <div className="text-xs font-bold text-[#333] tracking-widest">
            NINTENDO
          </div>
          <div className="text-lg font-bold text-[#333] tracking-wider">
            GAME BOY
          </div>
          <div className="text-[8px] text-[#333] tracking-wider italic">TM</div>
        </div>

        {/* Screen Area */}
        <div className="w-[280px] h-[250px] bg-[#606060] rounded-lg p-4 mb-6 shadow-inner">
          <div className="flex items-center justify-between mb-2">
            <div
              className={`w-2 h-2 rounded-full ${isPoweredOn ? "bg-red-500" : "bg-gray-500"}`}
            ></div>
            <div className="text-xs text-white opacity-70">BATTERY</div>
          </div>
          {isPoweredOn ? (
            <EmulatorScreen
              isGameRunning={gameRunning}
              colorPalette={colorPalette}
              onGameOver={handleGameOver}
              onScoreUpdate={handleScoreUpdate}
              onButtonPress={onButtonPress}
              soundEnabled={soundEnabled}
              volume={volume}
            />
          ) : (
            <div className="w-[240px] h-[216px] bg-gray-800"></div>
          )}
        </div>

        {/* Controls Area */}
        <EmulatorControls
          onButtonPress={handleButtonPress}
          onDirectionPress={handleDirectionPress}
        />

        {/* Bottom Area */}
        <div className="absolute bottom-4 w-full flex justify-between px-8">
          <div className="flex items-center">
            <div
              className="w-8 h-8 rounded-full bg-[#404040] flex items-center justify-center cursor-pointer"
              onClick={togglePower}
            >
              <div className="text-xs text-white">⏻</div>
            </div>
            <div className="ml-2 text-xs text-[#404040]">
              {isPoweredOn ? "ON" : "OFF"}
            </div>
          </div>

          <div className="flex items-center">
            <div className="text-xs text-[#404040] mr-2">VOL</div>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              disabled={!isPoweredOn}
              className="w-16 h-2 bg-[#a0a088] rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-16 right-4 text-[8px] text-[#404040] rotate-90">
          DOT MATRIX WITH STEREO SOUND
        </div>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-[8px] text-[#404040]">
          © 1989 Nintendo
        </div>
      </Card>

      {isPoweredOn && (
        <div className="mt-4 text-center text-gray-700">
          <p className="font-bold">Score: {score}</p>
        </div>
      )}
    </div>
  );
};

export default GameboyEmulator;
