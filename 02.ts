import fs from 'fs';
import readline from 'readline'

runner_star_one(150);
runner_star_two(900);

function runner_star_one(expectedTestResult: number, run = 'test', day = __filename.replace('.ts', '')) {
  const lineReader = readline.createInterface({
    input: fs.createReadStream(`${day}.${run}`)
  });

  // INIT
  let horizontal = 0;
  let vertical = 0;

  // LINES

  lineReader.on('line', function(line) {
    const [cmd, val] = line.split(' ');
    if(cmd === 'forward') {
      horizontal += +val;
      return;
    }
    if(cmd === 'up') {
      vertical -= +val;
      return;
    }
    if(cmd === 'down') {
      vertical += +val;
      return;
    }
  })

    .on('close', () => {
      const result = horizontal * vertical;

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
  let horizontal = 0;
  let vertical = 0;
  let aim = 0;

  // LINES

  lineReader.on('line', function(line) {
    const [cmd, val] = line.split(' ');
    if(cmd === 'forward') {
      horizontal += +val;
      vertical += aim * +val;
      return;
    }
    if(cmd === 'up') {
      aim -= +val;
      return;
    }
    if(cmd === 'down') {
      aim += +val;
      return;
    }
  })

    .on('close', () => {
      const result = horizontal * vertical;
      if (run === 'test' && result === expectedTestResult) {
        console.log(`Star 2 - test result: ${result}, expected was: ${expectedTestResult}`);
        runner_star_two(-1, 'input');
        return;
      }
      console.log(`Star 2 - input result: ${result}`);
    });
}
