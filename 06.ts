import {readLines, reRunWithInput} from './helpers';

runner_star_one(5934);
runner_star_two(26984457539);


async function runner_star_one(expectedTestResult: number, run = 'test', day = __filename.replace('.ts', '')) {
  // INIT
  const lines = await readLines(day, run);

  const state: number[] = [];

  // LINES

  lines.forEach((line) => {
    line.split(',').forEach((fish) => {
      state.push(+fish);
    })
  });


  for (let day = 0; day < 80; day++) {
    let fishToAppend = 0;
    for (let i = 0; i < state.length; i++) {
      if(state[i] === 0) {
        fishToAppend++;
        state[i] = 6;
        continue; // reset the loop
      }

      // default
      state[i] = state[i] - 1;
    }

    for (let j = 0; j < fishToAppend; j++) {
      state.push(8);
    }

  }

  const result = state.length;

  if (run === 'test') {
    return reRunWithInput(result, expectedTestResult, runner_star_one);
  }
  console.log(`Star 1 - input result: ${result}`);

}


async function runner_star_two(expectedTestResult: number, run = 'test', day = __filename.replace('.ts', '')) {
  // INIT
  const lines = await readLines(day, run);

  const state: BigUint64Array = new BigUint64Array(9);
  // LINES

  lines.forEach((line) => {
    line.split(',').forEach((fish) => {
      state[+fish]++;
    })
  });


  for (let day = 0; day < 256; day++) {
    const dayZeroFish = state[0];
    for (let i = 0; i <= 7; i++) {
      state[i] = state[i + 1];
      if(i === 6) {
        state[i] += dayZeroFish;
      }
    }

    state[8] = dayZeroFish;

  }

  const result = state.reduce((a, b) => a + b, BigInt(0));

  if (run === 'test') {
    console.log(`Star 2 - test result: ${result}`);
    runner_star_two(-1, 'input');
    // return reRunWithInput(-1, expectedTestResult, runner_star_two);
  }
  console.log(`Star 2 - input result: ${result}`);

}
