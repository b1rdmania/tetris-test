import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import miladyImg from "/milady.png";

interface EmulatorControlsProps {
  onDirectionPress?: (direction: "up" | "down" | "left" | "right") => void;
  onButtonPress?: (button: "a" | "b" | "start" | "select") => void;
}

const EmulatorControls = ({
  onDirectionPress = () => {},
  onButtonPress = () => {},
}: EmulatorControlsProps) => {
  const [activeButtons, setActiveButtons] = useState<Record<string, boolean>>({
    up: false,
    down: false,
    left: false,
    right: false,
    a: false,
    b: false,
    start: false,
    select: false,
  });

  const handleButtonDown = (button: string) => {
    setActiveButtons((prev) => ({ ...prev, [button]: true }));

    if (["up", "down", "left", "right"].includes(button)) {
      onDirectionPress(button as "up" | "down" | "left" | "right");
    } else if (["a", "b", "start", "select"].includes(button)) {
      onButtonPress(button as "a" | "b" | "start" | "select");
    }
  };

  const handleButtonUp = (button: string) => {
    setActiveButtons((prev) => ({ ...prev, [button]: false }));
  };

  return (
    <div className="bg-gray-200 p-4 rounded-b-3xl w-full max-w-[350px] h-[250px] flex flex-col items-center">
      {/* D-Pad */}
      <div className="relative w-32 h-32 mb-4">
        <button
          className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-md flex items-center justify-center ${activeButtons.up ? "bg-gray-500" : "bg-gray-700"}`}
          onPointerDown={(e) => {
            e.preventDefault();
            handleButtonDown("up");
          }}
          onPointerUp={(e) => {
            e.preventDefault();
            handleButtonUp("up");
          }}
          aria-label="Up"
        >
          <ArrowUp className="text-white" size={20} />
        </button>
        <button
          className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-md flex items-center justify-center ${activeButtons.down ? "bg-gray-500" : "bg-gray-700"}`}
          onPointerDown={(e) => {
            e.preventDefault();
            handleButtonDown("down");
          }}
          onPointerUp={(e) => {
            e.preventDefault();
            handleButtonUp("down");
          }}
          aria-label="Down"
        >
          <ArrowDown className="text-white" size={20} />
        </button>
        <button
          className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-md flex items-center justify-center ${activeButtons.left ? "bg-gray-500" : "bg-gray-700"}`}
          onPointerDown={(e) => {
            e.preventDefault();
            handleButtonDown("left");
          }}
          onPointerUp={(e) => {
            e.preventDefault();
            handleButtonUp("left");
          }}
          aria-label="Left"
        >
          <ArrowLeft className="text-white" size={20} />
        </button>
        <button
          className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-md flex items-center justify-center ${activeButtons.right ? "bg-gray-500" : "bg-gray-700"}`}
          onPointerDown={(e) => {
            e.preventDefault();
            handleButtonDown("right");
          }}
          onPointerUp={(e) => {
            e.preventDefault();
            handleButtonUp("right");
          }}
          aria-label="Right"
        >
          <ArrowRight className="text-white" size={20} />
        </button>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-gray-700 rounded-md"></div>
      </div>

      {/* Action Buttons and Start/Select */}
      <div className="flex justify-between w-full px-4">
        {/* Start and Select buttons */}
        <div className="flex items-center">
          <div className="flex flex-col space-y-2">
            <Button
              variant="outline"
              className={`w-16 h-6 rounded-full text-xs ${activeButtons.select ? "bg-gray-400" : "bg-gray-300"}`}
              onPointerDown={(e) => {
                e.preventDefault();
                handleButtonDown("select");
              }}
              onPointerUp={(e) => {
                e.preventDefault();
                handleButtonUp("select");
              }}
            >
              SELECT
            </Button>
            <Button
              variant="outline"
              className={`w-16 h-6 rounded-full text-xs ${activeButtons.start ? "bg-gray-400" : "bg-gray-300"}`}
              onPointerDown={(e) => {
                e.preventDefault();
                handleButtonDown("start");
              }}
              onPointerUp={(e) => {
                e.preventDefault();
                handleButtonUp("start");
              }}
            >
              START
            </Button>
          </div>
          <img src={miladyImg} alt="Milady" className="h-14 ml-2" />
        </div>

        {/* A and B buttons */}
        <div className="flex space-x-4 items-center">
          <button
            className={`w-12 h-12 rounded-full ${activeButtons.b ? "bg-red-600" : "bg-red-500"} text-white font-bold text-xl`}
            onPointerDown={(e) => {
              e.preventDefault();
              handleButtonDown("b");
            }}
            onPointerUp={(e) => {
              e.preventDefault();
              handleButtonUp("b");
            }}
          >
            B
          </button>
          <button
            className={`w-12 h-12 rounded-full ${activeButtons.a ? "bg-red-600" : "bg-red-500"} text-white font-bold text-xl`}
            onPointerDown={(e) => {
              e.preventDefault();
              handleButtonDown("a");
            }}
            onPointerUp={(e) => {
              e.preventDefault();
              handleButtonUp("a");
            }}
          >
            A
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmulatorControls;
