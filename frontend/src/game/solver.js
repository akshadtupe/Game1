import { move, getCells } from "./movement";

//Serialize state for visited tracking
function serialize(state) {
  return `${state.x},${state.y},${state.orientation}`;
}

//Check if state is valid on grid
function isValidState(state, grid) {
  const cells = getCells(state);

  return cells.every(([x, y]) => {
    return grid[y] && grid[y][x] === 1;
  });
}

//Check goal condition
function isGoal(state, target) {
  return (
    state.orientation === "standing" &&
    state.x === target[0] &&
    state.y === target[1]
  );
}

//BFS Solver (guaranteed shortest path)
export function solveLevel(level) {
  const { grid, start, target } = level;

  const startState = {
    x: start.x,
    y: start.y,
    orientation: "standing",
  };

  const queue = [];
  const visited = new Set();

  queue.push({
    state: startState,
    steps: 0,
  });

  visited.add(serialize(startState));

  const directions = ["up", "down", "left", "right"];

  while (queue.length > 0) {
    const { state, steps } = queue.shift();

    //Goal reached
    if (isGoal(state, target)) {
      return steps;
    }

    for (let dir of directions) {
      const nextState = move(state, dir);

      //Skip invalid states
      if (!isValidState(nextState, grid)) continue;

      const key = serialize(nextState);

      //Skip visited
      if (visited.has(key)) continue;

      visited.add(key);

      queue.push({
        state: nextState,
        steps: steps + 1,
      });
    }
  }

  //No solution exists
  return -1;
}