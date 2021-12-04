import {readLines, reRunWithInput} from './helpers';

runner_star_one(198);
runner_star_two(230);

async function runner_star_one(expectedTestResult: number, run = 'test', day = __filename.replace('.ts', '')) {
  // INIT
  const lines = await readLines(day, run);
  const numBits = lines[0].length;
  const bitArray = initializeBitArray(numBits);

  // LINES
  lines.forEach((line) => {
    for (let i = 0; i < line.length; i++) {
      bitArray[i].push(+line.charAt(i));
    }
  });

  const totalBits = bitArray[0].length;
  let gamma = 0;
  let epsilon = 0;
  for (let i = 0; i < numBits; i++) {
    const averageVal = bitArray[i].reduce((acc, cur) => acc + cur, 0) / totalBits;
    if(Math.round(averageVal) === 0){
      gamma = (gamma << 1) | 0;
      epsilon = (epsilon << 1) | 1;
    } else {
      gamma = (gamma << 1) | 1;
      epsilon = (epsilon << 1) | 0;
    }
  }

  const result = gamma * epsilon;

  if (run === 'test' && result === expectedTestResult) {
    return reRunWithInput(result, expectedTestResult, runner_star_one);
  }
  console.log(`Star 1 - input result: ${result}`);
}

async function runner_star_two(expectedTestResult: number, run = 'test', day = __filename.replace('.ts', '')) {
  // INIT
  const lines = await readLines(day, run);

  // LINES

  const oxygen = reduce_lines(lines.slice(), 'oxy')[0];
  const co2 = reduce_lines(lines.slice(), 'co2')[0];

  const result = parseInt(oxygen, 2) * parseInt(co2, 2);
  if (run === 'test' && result === expectedTestResult) {
    return reRunWithInput(result, expectedTestResult, runner_star_two);
  }
  console.log(`Star 2 - input result: ${result}`);
}

function initializeBitArray(numBits: number) {
  const bitArray: Array<Array<number>> = []
  for (let i = 0; i < numBits; i++) {
    bitArray[i] = [];
  }

  return bitArray;
}

function reduce_lines(lines: string[], mode: string){
  const numBits = lines[0].length;
  for (let j = 0; j < numBits; j++) {
    const bitArray = initializeBitArray(numBits);
    lines.forEach((line) => {
      for (let i = 0; i < line.length; i++) {
        bitArray[i].push(+line.charAt(i));
      }
    });

    const totalBits = bitArray[j].length;
    let discriminator = '1';

    const averageVal = bitArray[j].reduce((acc, cur) => acc + cur, 0) / totalBits;
    if(Math.round(averageVal) === 0){
      discriminator = '0';
    }

    const tmpLines = [];
    for (let i = 0; i < lines.length; i++) {
      if(lines[i].charAt(j) === discriminator && mode === 'oxy') {
        tmpLines.push(lines[i]);
      }
      if(lines[i].charAt(j) !== discriminator && mode === 'co2') {
        tmpLines.push(lines[i]);
      }
    }
    lines = [...tmpLines];
    if(lines.length === 1) {
      return lines;
    }
  }
  return lines;
}
