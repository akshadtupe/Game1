export function getCells(block) {
  const { x, y, orientation } = block;

  if (orientation === "standing") return [[x, y]];

  if (orientation === "x") {
    return [
      [x, y],
      [x + 1, y],
    ];
  }

  if (orientation === "y") {
    return [
      [x, y],
      [x, y + 1],
    ];
  }
}

//movement transitions
export function move(block, dir) {
  const { x, y, orientation } = block;

  // STANDING
  if (orientation === "standing") {
    if (dir === "up") return { x, y: y - 2, orientation: "y" };
    if (dir === "down") return { x, y: y + 1, orientation: "y" };
    if (dir === "left") return { x: x - 2, y, orientation: "x" };
    if (dir === "right") return { x: x + 1, y, orientation: "x" };
  }

  //LYING X (horizontal)
  if (orientation === "x") {
    if (dir === "left") return { x: x - 1, y, orientation: "standing" };
    if (dir === "right") return { x: x + 2, y, orientation: "standing" };
    if (dir === "up") return { x, y: y - 1, orientation: "x" };
    if (dir === "down") return { x, y: y + 1, orientation: "x" };
  }

  //LYING Y (vertical)
  if (orientation === "y") {
    if (dir === "up") return { x, y: y - 1, orientation: "standing" };
    if (dir === "down") return { x, y: y + 2, orientation: "standing" };
    if (dir === "left") return { x: x - 1, y, orientation: "y" };
    if (dir === "right") return { x: x + 1, y, orientation: "y" };
  }

  return block;
}