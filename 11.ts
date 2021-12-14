import {readLines, reRunWithInput} from './helpers';

runner_star_one(1656);
runner_star_two(195);

async function runner_star_one(expectedTestResult: number, run = 'test', day = __filename.replace('.ts', '')) {
  // INIT
  const lines = await readLines(day, run);
  const octopi: {value: number, hasFlashed: boolean}[][] = []

  // LINES

  lines.forEach((line) => {
    octopi.push(line.split('').map(a => {
      return {value: +a, hasFlashed: false}
    }));
  });

  const maxX = octopi[0].length;
  const maxY = octopi.length;
  let result = 0;
  // printopus(0, octopi);
  for (let r = 1; r <= 100; r++) {

    octopi.flat().forEach(o => {
      if(o.hasFlashed){
        o.value = 0;
        result++;
      } else {
        o.value++;
      }
      o.hasFlashed = false
    });
    // printopus(r, octopi);

    while(octopi.flat().some(o => o.value >= 9 && !o.hasFlashed)) {
      for (let y = 0; y < maxY; y++) {
        for (let x = 0; x < maxX; x++) {
          const octopus = octopi[y][x];
          const neighbors: {x: number, y:number}[] = findNeighbors(x, y, maxX, maxY);
          if(octopus.value >= 9 && !octopus.hasFlashed){
            neighbors.forEach((n) => {
              octopi[n.y][n.x].value++;
            });
            octopus.hasFlashed = true;

          }
        }

      }
    }


  }
  // const result = 0;

  if (run === 'test') {
    return reRunWithInput(result, expectedTestResult, runner_star_one);
  }
  console.log(`Star 1 - input result: ${result}`);

}

async function runner_star_two(expectedTestResult: number, run = 'test', day = __filename.replace('.ts', '')) {
  // INIT
  const lines = await readLines(day, run);
  const octopi: {value: number, hasFlashed: boolean}[][] = []

  // LINES

  lines.forEach((line) => {
    octopi.push(line.split('').map(a => {
      return {value: +a, hasFlashed: false}
    }));
  });

  const maxX = octopi[0].length;
  const maxY = octopi.length;
  const allOctos = maxX * maxY;
  let result = 0;

  // printopus(0, octopi);
  for (let r = 1; r <= 9999; r++) {
    let flashesThisRound = 0;
    octopi.flat().forEach(o => {
      if(o.hasFlashed){
        o.value = 0;
        flashesThisRound++;
      } else {
        o.value++;
      }
      o.hasFlashed = false
    });
    // printopus(r, octopi);

    // if(r > 190){
    //   printopus(r, octopi);
    // }

    if(flashesThisRound === allOctos){
      result = r;
      break;
    }

    while(octopi.flat().some(o => o.value >= 9 && !o.hasFlashed)) {
      for (let y = 0; y < maxY; y++) {
        for (let x = 0; x < maxX; x++) {
          const octopus = octopi[y][x];
          const neighbors: {x: number, y:number}[] = findNeighbors(x, y, maxX, maxY);
          if(octopus.value >= 9 && !octopus.hasFlashed){
            neighbors.forEach((n) => {
              octopi[n.y][n.x].value++;
            });
            octopus.hasFlashed = true;

          }
        }

      }
    }


  }
  // const result = 0;

  if (run === 'test') {
    return reRunWithInput(result, expectedTestResult, runner_star_two, '2');
  }
  console.log(`Star 1 - input result: ${result}`);

}

function printopus(step: number, octopi: {value: number, hasFlashed: boolean}[][]) {
  console.log(`\nStep ${step}:`)
  for (let index = 0; index < octopi.length; index++) {
    console.log(octopi[index].map(o => o.value).join(''));
  }
}

function findNeighbors(x: number, y: number, maxX: number, maxY: number): {x: number, y:number}[] {
  const res: {x: number, y:number}[] = [];
  const xMinusOne = x - 1;
  const xPlusOne = x + 1;
  const yMinusOne = y - 1;
  const yPlusOne = y + 1;

  res.push({x: x, y: yMinusOne});
  res.push({x: x, y: yPlusOne});
  res.push({x: xMinusOne, y: y});
  res.push({x: xPlusOne, y: y});
  res.push({x: xPlusOne, y: yMinusOne});
  res.push({x: xPlusOne, y: yPlusOne});
  res.push({x: xMinusOne, y: yPlusOne});
  res.push({x: xMinusOne, y: yMinusOne});
  return res.filter(a => {
    return a.x >= 0 && a.x < maxX && a.y >= 0 && a.y < maxY;
  });
}
