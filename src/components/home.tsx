import React, { useState, useCallback } from "react";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import GameboyEmulator from "./GameboyEmulator";
import EmulatorOptions from "./EmulatorOptions";

const Home = () => {
  const [colorPalette, setColorPalette] = useState<
    "classic" | "blackwhite" | "blue" | "red"
  >("classic");
  const [screenSize, setScreenSize] = useState<number>(100);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(80);
  const [isGameRunning, setIsGameRunning] = useState<boolean>(false);

  const handleColorPaletteChange = useCallback((palette: string) => {
    setColorPalette(palette as "classic" | "blackwhite" | "blue" | "red");
  }, []);

  const handleScreenSizeChange = useCallback((size: number) => {
    setScreenSize(size);
  }, []);

  const handleSoundToggle = useCallback((enabled: boolean) => {
    setSoundEnabled(enabled);
  }, []);

  const handleVolumeChange = useCallback((value: number) => {
    setVolume(value);
  }, []);

  const handleButtonPress = useCallback(
    (button: string) => {
      if (button === "start" && !isGameRunning) {
        setIsGameRunning(true);
      }
    },
    [isGameRunning],
  );

  return (
    <div className="min-h-screen w-full bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="flex justify-center">
          <GameboyEmulator
            colorPalette={colorPalette}
            screenSize={screenSize}
            soundEnabled={soundEnabled}
            volume={volume}
            isGameRunning={isGameRunning}
            onButtonPress={handleButtonPress}
          />
        </div>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p className="mt-4 text-xs">
            © 2023 - All rights to original Tetris game belong to The Tetris
            Company
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
