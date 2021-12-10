import {readLines, reRunWithInput} from './helpers';

runner_star_one(7);


async function runner_star_one(expectedTestResult: number, run = 'test', day = __filename.replace('.ts', '')) {
  // INIT
  const lines = await readLines(day, run);

  // LINES

  lines.forEach((line) => {
    // Do something;
  });


  if (run === 'test') {
    return reRunWithInput(result, expectedTestResult, runner_star_one);
  }
  console.log(`Star 1 - input result: ${result}`);

}
