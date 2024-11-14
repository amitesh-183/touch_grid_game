import React, { useState, useEffect } from "react";

export default function TouchGrid() {
  const GRID_SIZE = 20;
  const [grid, setGrid] = useState(
    Array(GRID_SIZE).fill(Array(GRID_SIZE).fill(false))
  );
  const [activeSquare, setActiveSquare] = useState(null);
  const [squareSize, setSquareSize] = useState(1);
  const [initialClickPosition, setInitialClickPosition] = useState(null);
  const [isExpanding, setIsExpanding] = useState(false);

  useEffect(() => {
    let intervalId;

    if (activeSquare && isExpanding) {
      intervalId = setInterval(() => {
        setSquareSize((prevSize) => {
          const newSize = prevSize + 2;
          if (newSize > GRID_SIZE * 2) {
            setSquareSize(1);
            return 1;
          }
          return newSize;
        });
      }, 500);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [activeSquare, isExpanding]);

  useEffect(() => {
    if (initialClickPosition) {
      const [centerX, centerY] = initialClickPosition;
      const newGrid = Array(GRID_SIZE)
        .fill()
        .map(() => Array(GRID_SIZE).fill(false));

      const halfSize = Math.floor(squareSize / 2);

      for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
          const distanceX = Math.abs(i - centerX);
          const distanceY = Math.abs(j - centerY);

          if (
            (distanceX === halfSize && distanceY <= halfSize) ||
            (distanceY === halfSize && distanceX <= halfSize)
          ) {
            newGrid[i][j] = true;
          }
        }
      }

      setGrid(newGrid);
    }
  }, [initialClickPosition, squareSize]);

  const handleCellClick = (x, y) => {
    if (
      !initialClickPosition ||
      x !== initialClickPosition[0] ||
      y !== initialClickPosition[1]
    ) {
      setInitialClickPosition([x, y]);
      setActiveSquare([x, y]);
      setSquareSize(1);
      setIsExpanding(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <h1 className="font-semibold pb-10 md:text-6xl text-4xl text-white text-center">
        Touch Grid Game
      </h1>
      <div
        className={`grid gap-1 bg-black rounded ${isExpanding ? "" : "border"}`}
        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
      >
        {grid.map((row, x) =>
          row.map((cell, y) => (
            <div
              key={`${x}-${y}`}
              className={`w-5 h-5 rounded-sm ${
                cell ? "bg-blue-500" : "bg-black"
              } cursor-pointer transition-colors duration-300`}
              onClick={() => handleCellClick(x, y)}
            />
          ))
        )}
      </div>
    </div>
  );
}
