import {readLines, reRunWithInput} from './helpers';

runner_star_one(26);
runner_star_two(61229);


async function runner_star_one(expectedTestResult: number, run = 'test', day = __filename.replace('.ts', '')) {
  // INIT
  const lines = await readLines(day, run);
  const patterns: string[][] = [];
  const outputs: string[][] = [];
  // LINES

  lines.forEach((line) => {
    const p_o = line.split(' | ');
    patterns.push(p_o[0].split(' '));
    outputs.push(p_o[1].split(' '));
  });

  let result = 0

  outputs.forEach((op) => {
    op.forEach(item => {
      if([2, 3, 4, 7].includes(item.length)) {
        result++;
      }
    })
  })

  if (run === 'test') {
    return reRunWithInput(result, expectedTestResult, runner_star_one);
  }
  console.log(`Star 1 - input result: ${result}`);

}


async function runner_star_two(expectedTestResult: number, run = 'test', day = __filename.replace('.ts', '')) {
  // INIT
  const lines = await readLines(day, run);
  const patterns: string[][] = [];
  const outputs: string[][] = [];
  const wholeLines: string[][] = [];
  // LINES

  lines.forEach((line) => {
    const p_o = line.split(' | ');
    patterns.push(p_o[0].split(' '));
    outputs.push(p_o[1].split(' '));
    wholeLines.push(p_o[0].split(' '))
    wholeLines.push(p_o[1].split(' '))
  });

  let result = 0


  for (let i = 0; i < patterns.length; i++) {
    const pattern = patterns[i];
    const output = outputs[i];
    const outputs_split = output.map(a => a.split('')).map(a => a.sort());

    const one = pattern.find(l => l.length === 2)?.split('').sort();
    const four = pattern.find(l => l.length === 4)?.split('').sort();
    const seven = pattern.find(l => l.length === 3)?.split('').sort();
    const eight = pattern.find(l => l.length === 7)?.split('').sort();
    // this beauty results in exactly three arrays of characters sorted alphabetically
    const sixNineOrZero = pattern.filter(l => l.length === 6).map(a => a.split('')).map(a => a.sort());
    const six = sixNineOrZero.find(snz => !one?.every(x => snz.includes(x)));
    const nine = sixNineOrZero.find(snz => four?.every(x => snz.includes(x)));
    let zero: string[] | undefined = [];
    if(six && nine) {
      zero = sixNineOrZero?.map(a => a?.join(''));
      const seix_joined = six?.join('');
      const nine_joined = nine?.join('');
      const iof = zero.indexOf(seix_joined);
      const iot = zero.indexOf(nine_joined);
      zero = sixNineOrZero?.find((val, idx) => ![iof, iot].includes(idx));
    }
    const twoThreeOrFive = pattern.filter(l => l.length === 5).map(a => a.split('')).map(a => a.sort());
    const five = twoThreeOrFive.find(ttf => ttf.every(x => six?.includes(x)));
    const three = twoThreeOrFive.find(ttf => one?.every(x => ttf.includes(x)));
    let two : string[] | undefined = [];
    if(five && three) {
      two = twoThreeOrFive?.map(a => a?.join(''));
      const five_joined = five?.join('');
      const three_joined = three?.join('');
      const iof = two.indexOf(five_joined);
      const iot = two.indexOf(three_joined);
      two = twoThreeOrFive?.find((val, idx) => ![iof, iot].includes(idx));
      // const k = twoThreeOrFive.splice(twoThreeOrFive.indexOf(five)).splice(twoThreeOrFive.indexOf(three));
      // two = k.pop();
    }

    const mapping = [zero, one, two, three, four, five, six, seven, eight, nine].map(a => a?.join(''));

    let outVal = 0;
    for(let j = 0; j < 4 ; j++) {
      // const multiplier = 10 ^ [j-3];
      const toFind = outputs_split[j].join('');
      const index = mapping.indexOf(toFind);
      outVal += index * Math.pow(10, (3 - j));
    }
    // console.log(outVal);
    result += outVal;
  }

  if (run === 'test') {
    return reRunWithInput(result, expectedTestResult, runner_star_two, '2');
  }
  console.log(`Star 2 - input result: ${result}`);

}


// function find1478(string[] values)
