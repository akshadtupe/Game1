class Logger {
  constructor() {
    this.logs = [];
    this.startTime = Date.now();
    this.lastMoveTime = null;
    this.runId = 0;
  }

  resetRun() {
    this.runId = 0;
    this.lastMoveTime = null;
    this.startTime = Date.now();
  }

  logMove(dir, block, levelIndex) {
    const now = Date.now();

    if (!this.lastMoveTime) {
      this.logs.push({
        event: "first_input",
        value: now - this.startTime,
        run: this.runId,
      });
    } else {
      this.logs.push({
        event: "latency",
        value: now - this.lastMoveTime,
        run: this.runId,
        level: levelIndex,
      });
    }

    this.lastMoveTime = now;

    this.logs.push({
      event: "move",
      direction: dir,
      position: [block.x, block.y],
      orientation: block.orientation,
      timestamp: now,
      run: this.runId,
      level: levelIndex,    
    });
  }

  logFail(block, levelIndex) {
    this.logs.push({
      event: "fail",
      position: [block.x, block.y],
      timestamp: Date.now(),
      run: this.runId,
      level: levelIndex,
    });

    this.runId++;
    this.lastMoveTime = null;
  }

  logWin(data, levelIndex) {
  this.logs.push({
    event: "win",
    timestamp: Date.now(),
    run: this.runId,
    ...data, 
    level: levelIndex,
  });

  this.runId++;
  this.lastMoveTime = null;
}

  export() {
    return this.logs;
  }
}

export const logger = new Logger();
