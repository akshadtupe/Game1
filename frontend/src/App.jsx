import { useState, useEffect } from "react";
import Grid from "./components/Grid";
import { getCells, move } from "./game/movement";
import { isValid } from "./game/validation";
import { logger } from "./telemetry/logger";
import { extractFeatures } from "./telemetry/features";
import { LEVELS } from "./game/levels"; // ✅ ADD THIS
import { solveLevel } from "./game/solver";
import { useMemo } from "react";

export default function App() {

  
  const [levelIndex, setLevelIndex] = useState(0);
  const currentLevel = LEVELS[levelIndex];
  

  const [block, setBlock] = useState({
    x: currentLevel.start.x,
    y: currentLevel.start.y,
    orientation: "standing",
  });

  const [gameOver, setGameOver] = useState(false);
  const [moves, setMoves] = useState(0);
  const [resets, setResets] = useState(0);

  const blockCells = getCells(block);

  const optimalMoves = useMemo(() => {
  const result = solveLevel(currentLevel);
  console.log("Optimal Moves:", result);
  return result;
}, [levelIndex]);

  //Movement logic
  function handleMove(dir) {
    if (gameOver) return;

    const newBlock = move(block, dir);

    if (!isValid(newBlock, currentLevel.grid)) {
      logger.logFail(newBlock, levelIndex);

      setBlock({
        x: currentLevel.start.x,
        y: currentLevel.start.y,
        orientation: "standing",
      });

      setResets((r) => r + 1);
      return;
    }

    logger.logMove(dir, newBlock, levelIndex);
    setBlock(newBlock);
    setMoves((m) => m + 1);

    //win condition
  if (
  newBlock.orientation === "standing" &&
  newBlock.x === currentLevel.target[0] &&
  newBlock.y === currentLevel.target[1]
  ) {
  //Compute optimal moves for this level
  const optimal = solveLevel(currentLevel);

  console.log("WIN DEBUG:", {
    optimal,
    playerMoves: moves + 1,
  });

  logger.logWin({
    ...newBlock,
    optimalMoves: optimal,
    playerMoves: moves + 1,
    excessMoves: (moves + 1) - optimal,
    level: levelIndex
  }, levelIndex);

  if (levelIndex < LEVELS.length - 1) {
    setLevelIndex((i) => i + 1);
  } else {
    setGameOver(true);
    alert("All Levels Complete!");
  }
}
  }

  //Keyboard listener (TOP LEVEL)
  useEffect(() => {
    if (gameOver) return;

    const handleKey = (e) => {
      if (e.key === "ArrowUp") handleMove("up");
      if (e.key === "ArrowDown") handleMove("down");
      if (e.key === "ArrowLeft") handleMove("left");
      if (e.key === "ArrowRight") handleMove("right");
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [block, gameOver]);

  //Reset block when level changes
  useEffect(() => {
    logger.resetLevelTelemetry();
    setBlock({
      x: currentLevel.start.x,
      y: currentLevel.start.y,
      orientation: "standing",
    });

    setMoves(0); 
    setResets(0);
  }, [levelIndex]);

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Red Block Grid</h1>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <p>Level: {levelIndex + 1}</p>
        <p>Moves: {moves}</p>
        <p>Resets: {resets}</p>
        <p>Optimal: {optimalMoves}</p>
        {/* <p>Excess Moves: {moves - optimalMoves}</p> */}
      </div>

      <Grid
        blockCells={blockCells}
        grid={currentLevel.grid}
        target={currentLevel.target}
      />

      <button
  onClick={async () => {
    const logs = logger.export();
    const features = extractFeatures(logs, levelIndex);

    console.log("Sending:", features);

    try {
      const res = await fetch("http://127.0.0.1:8000/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          player_id: "player_" + Date.now(),
          features: features,
        } ), 
      });

      const data = await res.json();
      console.log("Response:", data);
    } catch (err) {
      console.error("Error sending data:", err);
    }
  }}
>
  Send Data
</button>
    </div>
  );
}
