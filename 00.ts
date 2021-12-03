import fs from 'fs';
import readline from 'readline'

runner_star_one(7);
runner_star_two(5);

function runner_star_one(expectedTestResult: number, run = 'test', day = __filename.replace('.ts', '')) {
  const lineReader = readline.createInterface({
    input: fs.createReadStream(`${day}.${run}`)
  });

  // INIT
  const result = 0;

  // LINES

  lineReader.on('line', function(line) {

  })

    .on('close', () => {
      if (run === 'test' && result === expectedTestResult) {
        console.log(`Star 1 - test result: ${result}, expected was: ${expectedTestResult}`);
        runner_star_one(-1, 'input');
        return;
      }
      console.log(`Star 1 - input result: ${result}`);
    });
}

function runner_star_two(expectedTestResult: number, run = 'test', day = __filename.replace('.ts', '')) {
  const lineReader = readline.createInterface({
    input: fs.createReadStream(`${day}.${run}`)
  });

  // INIT
  const result = 0;

  // LINES

  lineReader.on('line', function(line) {

  })

    .on('close', () => {
      if (run === 'test' && result === expectedTestResult) {
        console.log(`Star 2 - test result: ${result}, expected was: ${expectedTestResult}`);
        runner_star_two(-1, 'input');
        return;
      }
      console.log(`Star 2 - input result: ${result}`);
    });
}
