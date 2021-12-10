import {readLines, reRunWithInput} from './helpers';

runner_star_one(37);
runner_star_two(168);

async function runner_star_one(expectedTestResult: number, run = 'test', day = __filename.replace('.ts', '')) {
  // INIT
  const lines = await readLines(day, run);
  let crabs: number[] = [];
  // LINES

  lines.forEach((line) => {
    crabs = line.split(',').map(a => +a);
  });

  const min = Math.min(...crabs);
  const max = Math.max(...crabs);

  let currentMin = Number.MAX_SAFE_INTEGER;
  let position = 0;

  for (let i = min; i < max; i++) {
    const sum = crabs.reduce((prev, curr) => prev + Math.abs(i - curr), 0);
    if(sum < currentMin) {
      position = i;
      currentMin = sum;
    }
  }

  console.log(`Min is ${currentMin} at position ${position}`)
  const result = currentMin;

  if (run === 'test') {
    return reRunWithInput(result, expectedTestResult, runner_star_one);
  }
  console.log(`Star 1 - input result: ${result}`);

}


async function runner_star_two(expectedTestResult: number, run = 'test', day = __filename.replace('.ts', '')) {
  // INIT
  const lines = await readLines(day, run);
  let crabs: number[] = [];
  // LINES

  lines.forEach((line) => {
    crabs = line.split(',').map(a => +a);
  });

  const min = Math.min(...crabs);
  const max = Math.max(...crabs);

  let currentMin = Number.MAX_SAFE_INTEGER;
  let position = 0;

  for (let i = min; i < max; i++) {
    const sum = crabs.reduce((prev, curr) => {
      const distance = Math.abs(i - curr);
      // https://cseweb.ucsd.edu/groups/tatami/kumo/exs/sum/#:~:text=Sum%20of%20the%20First%20n%20Natural%20Numbers&text=We%20prove%20the%20formula%201,inductive%20proof%20of%20this%20result.
      const fuel = distance * (distance + 1) / 2;
      return prev + fuel;
    }, 0);
    if(sum < currentMin) {
      position = i;
      currentMin = sum;
    }
  }

  console.log(`Min is ${currentMin} at position ${position}`)
  const result = currentMin;

  if (run === 'test') {
    return reRunWithInput(result, expectedTestResult, runner_star_two, '2');
  }
  console.log(`Star 2 - input result: ${result}`);

}
