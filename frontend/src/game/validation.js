// import { grid } from "./grid";
import { getCells } from "./movement";

export function isValid(block, grid) {
  const cells = getCells(block);

  return cells.every(([x, y]) => {
    // outside grid
    if (!grid[y] || grid[y][x] !== 1) {
      return false;
    }
    return true;
  });
}