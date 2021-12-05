import {readLines, reRunWithInput, twoDArray} from './helpers';

runner_star_one(5);
runner_star_two(12);

async function runner_star_one(expectedTestResult: number, run = 'test', day = __filename.replace('.ts', '')) {
  // INIT
  const lines = await readLines(day, run);
  let result = 0;

  // LINES

  const points: Array<{p1: {x: number, y: number}, p2: {x: number, y: number}}> = [];
  let maxX = 0, maxY = 0;

  lines.forEach((line) => {
    const l = line.split('->').map(a => a.trim());
    const p1Str = l[0].split(',').map(a => +a);
    const p2Str = l[1].split(',').map(a => +a);
    const pointSet = {
      p1: {x: p1Str[0], y: p1Str[1]},
      p2: {x: p2Str[0], y: p2Str[1]}
    };
    points.push(pointSet);
    // Set the limits to the maximum seen or present in the point
    maxX = Math.max(pointSet.p1.x, pointSet.p2.x, maxX);
    maxY = Math.max(pointSet.p1.y, pointSet.p2.y, maxY);
  });

  const diagram = twoDArray(maxX, maxY);

  points.forEach(pSet => {
    const isHorizontal = pSet.p1.x === pSet.p2.x;
    const isVertical = pSet.p1.y === pSet.p2.y;


    if(isHorizontal || isVertical){
      const minX = Math.min(pSet.p1.x, pSet.p2.x);
      const maxX = Math.max(pSet.p1.x, pSet.p2.x);
      const minY = Math.min(pSet.p1.y, pSet.p2.y);
      const maxY = Math.max(pSet.p1.y, pSet.p2.y);
      for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
          diagram[x][y] = diagram[x][y] + 1;
        }
      }
    }
  })

  // console.log(diagram);

  for (let x = 0; x <= maxX; x++) {
    for (let y = 0; y <= maxY; y++) {
      if(diagram[x][y] >= 2) {
        result++;
      }
    }
  }

  if (run === 'test') {
    return reRunWithInput(result, expectedTestResult, runner_star_one);
  }
  console.log(`Star 1 - input result: ${result}`);

}

async function runner_star_two(expectedTestResult: number, run = 'test', day = __filename.replace('.ts', '')) {
  // INIT
  const lines = await readLines(day, run);
  let result = 0;

  // LINES

  const points: Array<{p1: {x: number, y: number}, p2: {x: number, y: number}}> = [];
  let maxX = 0, maxY = 0;

  lines.forEach((line) => {
    const l = line.split('->').map(a => a.trim());
    const p1Str = l[0].split(',').map(a => +a);
    const p2Str = l[1].split(',').map(a => +a);
    const pointSet = {
      p1: {x: p1Str[0], y: p1Str[1]},
      p2: {x: p2Str[0], y: p2Str[1]}
    };
    points.push(pointSet);
    // Set the limits to the maximum seen or present in the point
    maxX = Math.max(pointSet.p1.x, pointSet.p2.x, maxX);
    maxY = Math.max(pointSet.p1.y, pointSet.p2.y, maxY);
  });

  const diagram = twoDArray(maxY, maxX);

  points.forEach(pSet => {
    const p1 = pSet.p1;
    const p2 = pSet.p2;
    const minX = Math.min(p1.x, p2.x);
    const maxX = Math.max(p1.x, p2.x);
    const minY = Math.min(p1.y, p2.y);
    const maxY = Math.max(p1.y, p2.y);

    const isHorizontal = p1.x === p2.x;
    const isVertical = p1.y === p2.y;
    const isDiagonal = Math.abs(p1.y - p2.y) === Math.abs(p1.x - p2.x);

    if(isHorizontal || isVertical){
      for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
          diagram[y][x] = diagram[y][x] + 1;
        }
      }
    }

    if(isDiagonal) {
      const diagonalLength = maxX - minX + 1;
      let startX = p1.x;
      let startY = p1.y;
      // let endX = p2.x;
      let endY = p2.y;
      if(p1.x > p2.x){
        startX = p2.x;
        startY = p2.y
        // endX = p1.x;
        endY = p1.y;
      }

      let direction = 1;
      if(startY > endY) {
        direction = -1;
      }

      for (let i = 0; i < diagonalLength; i++) {
        const r = i * direction;
        diagram[startY + r][startX + i] = diagram[startY + r][startX + i] + 1;
      }
    }

  })

  // console.log(diagram);

  for (let x = 0; x <= maxX; x++) {
    for (let y = 0; y <= maxY; y++) {
      if(diagram[x][y] >= 2) {
        result++;
      }
    }
  }

  if (run === 'test') {
    return reRunWithInput(result, expectedTestResult, runner_star_two, '2');
  }
  console.log(`Star 2 - input result: ${result}`);

}
