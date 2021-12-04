import {readLines, reRunWithInput} from './helpers';

runner_star_one(7);
runner_star_two(5);

async function runner_star_one(expectedTestResult: number, run = 'test', day = __filename.replace('.ts', '')) {
  // INIT
  const lines = await readLines(day, run);
  const result = 0;

  // LINES

  lines.forEach((line) => {
    // Do something;
  });


  if (run === 'test') {
    return reRunWithInput(result, expectedTestResult, runner_star_one);
  }
  console.log(`Star 1 - input result: ${result}`);

}

async function runner_star_two(expectedTestResult: number, run = 'test', day = __filename.replace('.ts', '')) {
  // INIT
  const lines = await readLines(day, run);
  const result = 0;

  // LINES

  lines.forEach((line) => {
    // Do something;
  });


  if (run === 'test') {
    return reRunWithInput(result, expectedTestResult, runner_star_two);
  }
  console.log(`Star 2 - input result: ${result}`);
}
