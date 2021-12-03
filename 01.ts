import fs from 'fs';
import readline from 'readline'

runner_star_one(__filename.replace('.ts', ''), 7);
runner_star_two(__filename.replace('.ts', ''), 5);

function runner_star_one(day: string, testResult: number, run = 'test') {
  const lineReader = readline.createInterface({
    input: fs.createReadStream(`${day}.${run}`)
  });

  let previousLineVal = 0;
  let counter = 0;

  lineReader.on('line', function(line) {
    const currentVal = parseInt(line);
    // console.log(currentVal < previousLineVal);
    if (previousLineVal > 0 && previousLineVal < currentVal) {
      counter++;
    }
    previousLineVal = currentVal;
  })
    .on('close', () => {
      console.log('one', run, counter, testResult);
      if (run === 'test' && counter === testResult) {
        runner_star_one(day, testResult, 'input')
      }
    });
}

function runner_star_two(day: string, testResult: number, run = 'test') {
  const lineReader = readline.createInterface({
    input: fs.createReadStream(`${day}.${run}`)
  });

  let previousWindowVal = 0;
  let currentWindowVal = 0;
  let counter = 0;
  let lineCounter = -1;
  const window: number[] = [];

  lineReader.on('line', function(line) {
    const currentVal = parseInt(line);
    lineCounter++;
    // Spin up
    if(lineCounter < 3) {
      window.push(currentVal);
      // console.log('spinup', window)
      return;
    }
    if(lineCounter === 3) {
      previousWindowVal = window.reduce((acc, cur) => acc + cur, 0);
    }
    // end spin up

    // main loop
    window.splice(0, 1);
    window.push(currentVal);
    currentWindowVal = window.reduce((acc, cur) => acc + cur, 0);
    // console.log(currentWindowVal, window);
    if(currentWindowVal > previousWindowVal) {
      counter++;
    }
    previousWindowVal = currentWindowVal;

  })

  lineReader.on('close', () => {
    console.log('two', run, counter, testResult)
    if (run === 'test' && counter === testResult) {
      runner_star_two(day, testResult, 'input')
    }
  });
}
