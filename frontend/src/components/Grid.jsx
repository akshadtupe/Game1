

export default function Grid({ blockCells, grid, target}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${grid[0].length}, 60px)`,
        gap: "6px",
        justifyContent: "center",
        marginTop: "60px",
      }}
    >
      {grid.flatMap((row, y) =>
        row.map((cell, x) => {
          const isBlock = blockCells?.some(
            ([cx, cy]) => cx === x && cy === y
          );

          return (
            <div
              key={`${x}-${y}`}
              style={{
                width: 60,
                height: 60,
                background: isBlock
                  ? "blue"
                  : x === target[0] && y === target[1]
                  ? "red"
                  : cell
                  ? "#ccc"
                  : "transparent",
                border: cell ? "1px solid #999" : "none",
              }}
            />
          );
        })
      )}
    </div>
  );
}