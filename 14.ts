import {readLines, reRunWithInput} from './helpers';

runner_star_one(1588);
runner_star_two(2188189693529);


async function runner_star_one(expectedTestResult: number, run = 'test', day = __filename.replace('.ts', '')) {
  // INIT
  const lines = await readLines(day, run);
  let polymerTemplate = '';
  const insertionrules: {pattern: string, insertion: string}[] = [];
  // LINES

  lines.forEach((line) => {
    if(!line.includes('->')) {
      polymerTemplate += line;
      return;
    }
    const [pattern, insertion] = line.split(' -> ');
    insertionrules.push({pattern, insertion});
  });

  for (let i = 0; i < 10; i++) {
    const polymerCopy = polymerTemplate;
    for (let j = 0; j < polymerCopy.length - 1; j++) {
      const pair = polymerCopy[j] + polymerCopy[j + 1]
      const insertion = insertionrules.find(ir => ir.pattern === pair)?.insertion ;
      if(insertion){
        polymerTemplate = polymerTemplate.slice(0, 2 * j + 1) + insertion + polymerTemplate.slice(2 * j + 1);
      }

    }
  }

  const distinctItems = new Set(polymerTemplate.split(''));
  const itemCountArray: {letter: string, count: number}[] = [];
  distinctItems.forEach(letter => {
    const count = polymerTemplate.split('').filter(l => l === letter).length;
    itemCountArray.push({letter, count});
  })

  itemCountArray.sort((a, b) => a.count - b.count);

  const result = itemCountArray[itemCountArray.length - 1].count - itemCountArray[0].count;
  if (run === 'test') {
    return reRunWithInput(result, expectedTestResult, runner_star_one);
  }
  console.log(`Star 1 - input result: ${result}`);

}


async function runner_star_two(expectedTestResult: number, run = 'test', day = __filename.replace('.ts', '')) {
  // INIT
  const lines = await readLines(day, run);
  let polymerTemplate = '';
  // const insertionrules: {pattern: string, insertion: string}[] = [];
  // const pairCount: {pattern: string, occurence: number}[] = [];
  const insertionrules: Record<string, string> = {};
  const pairCount: Record<string, number> = {};
  // LINES

  lines.forEach((line) => {
    if(!line.includes('->')) {
      polymerTemplate += line;
      return;
    }
    const [pattern, insertion] = line.split(' -> ');
    insertionrules[pattern] = insertion;
    pairCount[pattern] = 0;
  });

  for (let j = 0; j < polymerTemplate.length - 1; j++) {
    const pair = polymerTemplate[j] + polymerTemplate[j + 1]
    pairCount[pair] += 1;
  }

  for (let i = 0; i < 40; i++) {
    // console.log(`Iteration ${i} running...`);
    const polymerCopy = {...pairCount};

    for (const key in polymerCopy) {
      // for (let j = 0; j < polymerCopy[key]; j++) {
      const letters = key.split('');
      pairCount[key] -= polymerCopy[key];
      const newPair1 = letters[0] + insertionrules[key];
      const newPair2 = insertionrules[key] + letters[1] ;
      pairCount[newPair1] += polymerCopy[key];
      pairCount[newPair2] += polymerCopy[key];
      // }

    }

  }

  let allPairs = '';
  for(const key in pairCount){
    allPairs += key;
  }
  const distinctItems = new Set(allPairs.split(''));
  const itemCountArray: Record<string, number> = {};
  distinctItems.forEach(letter => itemCountArray[letter] = 0);

  for(const key in pairCount){
    const letters = key.split('');
    itemCountArray[letters[0]] += pairCount[key];
    itemCountArray[letters[1]] += pairCount[key];
  }

  const minMaxTracker: {minL: string, minN: number, maxL: string, maxN: number} = {minL: 'A', minN: Number.MAX_SAFE_INTEGER, maxL: 'B', maxN: 0}

  if(polymerTemplate.charAt(0) === polymerTemplate.charAt(polymerTemplate.length - 1)){
    itemCountArray[polymerTemplate.charAt(0)] += 2;
  }

  for(const letter in itemCountArray) {
    if(itemCountArray[letter] % 2 !== 0) {
      itemCountArray[letter] += 1;
    }
    itemCountArray[letter] = itemCountArray[letter] / 2;

    if(itemCountArray[letter] < minMaxTracker.minN) {
      minMaxTracker.minL = letter;
      minMaxTracker.minN = itemCountArray[letter];
    }

    if(itemCountArray[letter] > minMaxTracker.maxN) {
      minMaxTracker.maxL = letter;
      minMaxTracker.maxN = itemCountArray[letter];
    }
  }

  const result = minMaxTracker.maxN - minMaxTracker.minN;
  if (run === 'test') {
    return reRunWithInput(result, expectedTestResult, runner_star_two, '2');
  }
  console.log(`Star 2 - input result: ${result}`);

}
