import {readLines, reRunWithInput} from './helpers';

runner_star_one(26397);
runner_star_two(288957);


async function runner_star_one(expectedTestResult: number, run = 'test', day = __filename.replace('.ts', '')) {
  // INIT
  const lines = await readLines(day, run);
  const openingTags = '({<['.split('');
  // LINES

  let result = 0;

  lines.forEach((line) => {
    const lineTillNow: string[] = [];
    const splitLine = line.split('');


    for (let i = 0; i < splitLine.length; i++) {
      const bracket = splitLine[i];

      // This is am opening tag
      if(openingTags.includes(bracket)) {
        lineTillNow.push(bracket);
        continue;
      }

      // bracket is a closing tag
      const expectedBracket = relatedClosingBracket(lineTillNow[lineTillNow.length - 1]);
      if(expectedBracket === bracket) {
        lineTillNow.pop();
        continue;
      }
      // we are in the error case;
      result += illegalBracketValue(bracket);
      break;
    }
  });


  if (run === 'test') {
    return reRunWithInput(result, expectedTestResult, runner_star_one);
  }
  console.log(`Star 1 - input result: ${result}`);

}

async function runner_star_two(expectedTestResult: number, run = 'test', day = __filename.replace('.ts', '')) {
  // INIT
  const lines = await readLines(day, run);
  const openingTags = '({<['.split('');
  // LINES

  const lineValues: number[] = [];

  lines.forEach((line) => {
    const lineTillNow: string[] = [];
    const splitLine = line.split('');
    let corruptLine = false;

    for (let i = 0; i < splitLine.length; i++) {
      const bracket = splitLine[i];

      // This is am opening tag
      if(openingTags.includes(bracket)) {
        lineTillNow.push(bracket);
        continue;
      }

      // bracket is a closing tag
      const expectedBracket = relatedClosingBracket(lineTillNow[lineTillNow.length - 1]);
      if(expectedBracket === bracket) {
        lineTillNow.pop();
        continue;
      }
      // we are in the error case, ignore the line
      corruptLine = true;
      break;
    }

    if(corruptLine) {
      return; // foreach is a function, not a loop
    }

    lineValues.push(lineTillNow.reduceRight((prev, curr) => (5 * prev + starTwoClosingBracketValue(curr)), 0));

  });
  lineValues.sort((a, b) => a - b);
  const result = lineValues[Math.floor(lineValues.length / 2)]


  if (run === 'test') {
    return reRunWithInput(result, expectedTestResult, runner_star_two, '2');
  }
  console.log(`Star 2 - input result: ${result}`);

}

// Yes this is just a key-value pair, but implemented more complex :)
function relatedClosingBracket(openingBracket: string): string {
  switch (openingBracket) {
  case '[':
    return ']';
  case '{':
    return '}';
  case '<':
    return '>';
  case '(':
    return ')';


  default:
    throw new Error('No closing tag found');

  }
}


// Yes this is just a key-value pair, but implemented more complex :)
function illegalBracketValue(illegalBracket: string): number {
  switch (illegalBracket) {
  case ']':
    return 57;
  case '}':
    return 1197;
  case '>':
    return 25137;
  case ')':
    return 3;


  default:
    throw new Error('No value for bracket found');

  }
}

// Yes this is just a key-value pair, but implemented more complex :)
function starTwoClosingBracketValue(closingBracket: string): number {
  switch (closingBracket) {
  case '[':
    return 2;
  case '{':
    return 3;
  case '<':
    return 4;
  case '(':
    return 1;


  default:
    throw new Error('No value for bracket found');

  }
}
