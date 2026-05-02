export function extractFeatures(logs, levelIndex) {
  const runs = {};

  logs.forEach((log) => {
    const key = `${log.level}_${log.run}`;
    if (!runs[key]) runs[key] = [];
    runs[key].push(log);
  });

  const results = [];
  const levelRunMap = {};

  Object.keys(runs).forEach((key) => {
    const events = runs[key];

    let moveCount = 0;
    let latencies = [];
    let failCount = 0;
    let won = false;
    let firstInput = null;
    let optimalMoves = null;
    let excessMoves = null;
    let level = null;

    const positions = [];
    const failPositions = {};

    events.forEach((e) => {
      if (e.level !== undefined && level === null) {
        level = e.level;
      }

      if (e.event === "move") {
        moveCount++;
        positions.push(e.position.join(","));
      }

      if (e.event === "latency") {
        latencies.push(e.value);
      }

      if (e.event === "first_input") {
        firstInput = e.value;
      }

      if (e.event === "fail") {
        failCount++;
        const key = e.position.join(",");
        failPositions[key] = (failPositions[key] || 0) + 1;
      }

      if (e.event === "win") {
        won = true;
        if (e.optimalMoves !== undefined) {
          optimalMoves = e.optimalMoves;
        }
      }
    });

    if (won && optimalMoves !== null) {
      excessMoves = moveCount - optimalMoves;
    }

    if (moveCount === 0 && !won) return;

    const avgLatency =
      latencies.length > 0
        ? latencies.reduce((a, b) => a + b, 0) / latencies.length
        : 0;

    const uniquePositions = new Set(positions).size;

    const pathConsistency =
      moveCount > 0 ? uniquePositions / moveCount : 0;

    const repeatErrorRate =
      Object.values(failPositions).filter((v) => v > 1).length;

    const lvl = level ?? levelIndex;

    if (!levelRunMap[lvl]) levelRunMap[lvl] = 0;
    const normalizedRun = levelRunMap[lvl]++;
    
    results.push({
      level: lvl,
      run: normalizedRun,
      moves: moveCount,
      avg_latency: avgLatency,
      first_input_time: firstInput,
      fail_count: failCount,
      path_consistency: pathConsistency,
      repeat_error_rate: repeatErrorRate,
      success: won,
      optimal_moves: optimalMoves,
      excess_moves: excessMoves,
    });
  });

  return results;
}