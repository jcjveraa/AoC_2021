import {readLines, reRunWithInput} from './helpers';

runner_star_one(15);
runner_star_two(1134);

async function runner_star_one(expectedTestResult: number, run = 'test', day = __filename.replace('.ts', '')) {
  // INIT
  const lines = await readLines(day, run);
  const map: number[][] = [];
  // LINES
  let lineCounter = 0;
  lines.forEach((line) => {
    map[lineCounter] = [];
    line.split('').forEach(i => map[lineCounter].push(+i));
    lineCounter++;
  });

  const maxY = map.length;
  const maxX = map[0].length;
  let result = 0;

  for (let y = 0; y < maxY; y++) {
    for (let x = 0; x < maxX; x++) {
      const value = map[y][x];
      const isLowest = findLowest(x, y, maxX, maxY, value, map);
      if(isLowest) {
        result += 1 + value;
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
  const map: {value: number, visited: boolean}[][] = [];
  // LINES
  let lineCounter = 0;
  lines.forEach((line) => {
    map[lineCounter] = [];
    line.split('').forEach(i => map[lineCounter].push({value: +i, visited: false}));
    lineCounter++;
  });

  const maxY = map.length;
  const maxX = map[0].length;
  const basins: number[] = [];


  for (let y = 0; y < maxY; y++) {
    for (let x = 0; x < maxX; x++) {
      const item = map[y][x];
      if(item.visited){
        continue;
      }

      const isLowest = findLowest(x, y, maxX, maxY, item.value, map.map(i => i.map(j => j.value)));

      if(isLowest) {
        let basinSize = 1;
        item.visited = true;

        const toVisit: {x: number, y:number}[] = findNeighborsNotNine(x, y, maxX, maxY, map);
        const allVisited: {x: number, y:number}[] = findNeighborsNotNine(x, y, maxX, maxY, map);
        allVisited.push({x: x, y:y});
        while(toVisit.length !== 0){
          toVisit.forEach(z => map[z.y][z.x].visited = true);
          const current = toVisit.pop();
          if(current) {
            basinSize++;
            // map[current.y][current.x].visited = true;
            toVisit.push(...findNeighborsNotNine(current.x, current.y, maxX, maxY, map));

          }
        }

        basins.push(basinSize);
      }

    }

  }

  const result = basins.sort((a, b) => a - b).slice(-3).reduce((a, b) => a * b, 1);

  if (run === 'test') {
    return reRunWithInput(result, expectedTestResult, runner_star_two, '2');
  }
  console.log(`Star 2 - input result: ${result}`);
}

function findLowest(x: number, y: number, maxX: number, maxY: number, compareVal: number, map: number[][]): boolean {
  const filtered = findNeighbors(x, y, maxX, maxY)

  return filtered.every(f => map[f.y][f.x] > compareVal);
}

function findNeighbors(x: number, y: number, maxX: number, maxY: number) {
  const res: {x: number, y:number}[] = [];
  const xMinusOne = x - 1;
  const xPlusOne = x + 1;
  const yMinusOne = y - 1;
  const yPlusOne = y + 1;

  res.push({x: x, y: yMinusOne});
  res.push({x: x, y: yPlusOne});
  res.push({x: xMinusOne, y: y});
  res.push({x: xPlusOne, y: y});
  return res.filter(a => {
    return a.x >= 0 && a.x < maxX && a.y >= 0 && a.y < maxY;
  });
}


function findNeighborsNotNine(x: number, y: number, maxX: number, maxY: number, map: {value: number, visited:boolean}[][]) {
  const filtered = findNeighbors(x, y, maxX, maxY).filter(f => map[f.y][f.x].value < 9 && !map[f.y][f.x].visited);
  return filtered;
}
