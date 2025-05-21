import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface EmulatorOptionsProps {
  onScreenSizeChange?: (size: number) => void;
  onColorPaletteChange?: (palette: string) => void;
  onSoundToggle?: (enabled: boolean) => void;
  onVolumeChange?: (volume: number) => void;
  isOpen?: boolean;
}

const EmulatorOptions = ({
  onScreenSizeChange = () => {},
  onColorPaletteChange = () => {},
  onSoundToggle = () => {},
  onVolumeChange = () => {},
  isOpen = true,
}: EmulatorOptionsProps) => {
  const [screenSize, setScreenSize] = useState<number>(100);
  const [colorPalette, setColorPalette] = useState<string>("classic");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(80);

  const handleScreenSizeChange = (value: number[]) => {
    const newSize = value[0];
    setScreenSize(newSize);
    onScreenSizeChange(newSize);
  };

  const handleColorPaletteChange = (value: string) => {
    setColorPalette(value);
    onColorPaletteChange(value);
  };

  const handleSoundToggle = (checked: boolean) => {
    setSoundEnabled(checked);
    onSoundToggle(checked);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    onVolumeChange(newVolume);
  };

  if (!isOpen) return null;

  return (
    <Card className="w-[300px] bg-gray-100 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-gray-800">
          Emulator Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="screen-size" className="text-sm font-medium">
              Screen Size: {screenSize}%
            </Label>
          </div>
          <Slider
            id="screen-size"
            min={50}
            max={150}
            step={5}
            value={[screenSize]}
            onValueChange={handleScreenSizeChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="color-palette" className="text-sm font-medium">
            Color Palette
          </Label>
          <Select value={colorPalette} onValueChange={handleColorPaletteChange}>
            <SelectTrigger id="color-palette">
              <SelectValue placeholder="Select color palette" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="classic">Classic Green</SelectItem>
              <SelectItem value="bw">Black & White</SelectItem>
              <SelectItem value="blue">Blue</SelectItem>
              <SelectItem value="red">Red</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="sound-toggle" className="text-sm font-medium">
            Sound
          </Label>
          <Switch
            id="sound-toggle"
            checked={soundEnabled}
            onCheckedChange={handleSoundToggle}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="volume" className="text-sm font-medium">
              Volume: {volume}%
            </Label>
          </div>
          <Slider
            id="volume"
            min={0}
            max={100}
            step={5}
            disabled={!soundEnabled}
            value={[volume]}
            onValueChange={handleVolumeChange}
          />
        </div>

        <Button variant="outline" className="w-full mt-2">
          Reset to Defaults
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmulatorOptions;
