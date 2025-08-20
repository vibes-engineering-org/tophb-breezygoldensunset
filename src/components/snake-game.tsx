"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Position = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION: Direction = "RIGHT";
const GAME_SPEED = 150;

export default function SnakeGame() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [isGlowing, setIsGlowing] = useState(false);
  
  const gameLoopRef = useRef<NodeJS.Timeout>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateFood = useCallback(() => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood({ x: 15, y: 15 });
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setGameStarted(false);
    setScore(0);
    setLevel(1);
    setIsGlowing(false);
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
  };

  const moveSnake = useCallback(() => {
    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case "UP":
          head.y -= 1;
          break;
        case "DOWN":
          head.y += 1;
          break;
        case "LEFT":
          head.x -= 1;
          break;
        case "RIGHT":
          head.x += 1;
          break;
      }

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setIsGlowing(true);
        setTimeout(() => {
          setGameOver(true);
          setGameStarted(false);
        }, 200);
        return currentSnake;
      }

      // Check self collision
      if (currentSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setIsGlowing(true);
        setTimeout(() => {
          setGameOver(true);
          setGameStarted(false);
        }, 200);
        return currentSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prevScore => {
          const newScore = prevScore + 1;
          if (newScore % 10 === 0) {
            setLevel(prev => prev + 1);
          }
          return newScore;
        });
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, generateFood]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!gameStarted || gameOver) return;

    switch (e.key) {
      case "ArrowUp":
      case "w":
      case "W":
        if (direction !== "DOWN") setDirection("UP");
        break;
      case "ArrowDown":
      case "s":
      case "S":
        if (direction !== "UP") setDirection("DOWN");
        break;
      case "ArrowLeft":
      case "a":
      case "A":
        if (direction !== "RIGHT") setDirection("LEFT");
        break;
      case "ArrowRight":
      case "d":
      case "D":
        if (direction !== "LEFT") setDirection("RIGHT");
        break;
    }
  }, [direction, gameStarted, gameOver]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);
    } else if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameStarted, gameOver, moveSnake]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = isGlowing ? "#ff4444" : "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = isGlowing ? "#ffffff" : "#00ff00";
    snake.forEach((segment, index) => {
      if (index === 0) {
        // Head
        ctx.fillStyle = isGlowing ? "#ffcccc" : "#00cc00";
      } else {
        ctx.fillStyle = isGlowing ? "#ffffff" : "#00ff00";
      }
      ctx.fillRect(segment.x * 20, segment.y * 20, 18, 18);
    });

    // Draw food
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(food.x * 20, food.y * 20, 18, 18);
  }, [snake, food, isGlowing]);

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Snake Game</CardTitle>
        <div className="flex justify-between text-sm">
          <span>Score: {score}</span>
          <span>Level: {level}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            width={GRID_SIZE * 20}
            height={GRID_SIZE * 20}
            className="border-2 border-gray-300 bg-black"
          />
        </div>

        <div className="text-center space-y-2">
          {!gameStarted && !gameOver && (
            <Button onClick={startGame} className="w-full">
              Start Game
            </Button>
          )}
          
          {gameOver && (
            <div className="space-y-2">
              <p className="text-red-500 font-semibold">Game Over!</p>
              <p>Final Score: {score}</p>
              <p>Level Reached: {level}</p>
              <Button onClick={resetGame} className="w-full">
                Play Again
              </Button>
            </div>
          )}

          {gameStarted && !gameOver && (
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
              <div></div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => direction !== "DOWN" && setDirection("UP")}
              >
                ↑
              </Button>
              <div></div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => direction !== "RIGHT" && setDirection("LEFT")}
              >
                ←
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => direction !== "UP" && setDirection("DOWN")}
              >
                ↓
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => direction !== "LEFT" && setDirection("RIGHT")}
              >
                →
              </Button>
            </div>
          )}
        </div>

        <div className="text-xs text-center text-gray-500">
          Use arrow keys or WASD to control the snake
        </div>
      </CardContent>
    </Card>
  );
}