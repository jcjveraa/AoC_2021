import {readLines, reRunWithInput} from './helpers';

runner_star_one(17);
runner_star_two(0);

async function runner_star_one(expectedTestResult: number, run = 'test', day = __filename.replace('.ts', '')) {
  // INIT
  const lines = await readLines(day, run);
  const xyDots: {x: number, y: number}[] = [];
  const folds: {direction: string, line: number}[] = [];
  let foldMode = false;
  // LINES

  lines.forEach((line) => {
    if(line === '' && !foldMode) {
      foldMode = true;
      return
    }

    if(!foldMode) {
      const xy = line.split(',');
      xyDots.push({x: +xy[0], y: +xy[1]});
      return;
    }

    const foldVal = line.replace('fold along ', '').split('=');
    folds.push({direction: foldVal[0], line: +foldVal[1]});

  });

  [...xyDots].forEach(element => {
    if(folds[0].direction === 'y'){
      if(element.y > folds[0].line){
        xyDots.splice(xyDots.findIndex(e => e === element), 1);
        const newElement = {x: element.x, y: 2 * folds[0].line - element.y};
        if(!xyDots.find(e => e.x === newElement.x && e.y === newElement.y)) {
          xyDots.push(newElement);
        }
      }
    } else {
      if(element.x < folds[0].line){
        xyDots.splice(xyDots.findIndex(e => e === element), 1);
        const newElement = {x: 2 * folds[0].line - element.x, y: element.y};
        if(!xyDots.find(e => e.x === newElement.x && e.y === newElement.y)) {
          xyDots.push(newElement);
        }
      }
    }
  });

  const result = xyDots.length;
  if (run === 'test') {
    return reRunWithInput(result, expectedTestResult, runner_star_one);
  }
  console.log(`Star 1 - input result: ${result}`);

}


async function runner_star_two(expectedTestResult: number, run = 'test', day = __filename.replace('.ts', '')) {
  // INIT
  const lines = await readLines(day, run);
  const xyDots: {x: number, y: number}[] = [];
  const folds: {direction: string, line: number}[] = [];
  let foldMode = false;
  // LINES

  lines.forEach((line) => {
    if(line === '' && !foldMode) {
      foldMode = true;
      return
    }

    if(!foldMode) {
      const xy = line.split(',');
      xyDots.push({x: +xy[0], y: +xy[1]});
      return;
    }

    const foldVal = line.replace('fold along ', '').split('=');
    folds.push({direction: foldVal[0], line: +foldVal[1]});

  });

  for (let i = 0; i < folds.length; i++) {
    const fold = folds[i];

    [...xyDots].forEach(element => {
      if(fold.direction === 'y'){
        if(element.y > fold.line){
          xyDots.splice(xyDots.findIndex(e => e === element), 1);
          const newElement = {x: element.x, y: 2 * fold.line - element.y};
          if(!xyDots.find(e => e.x === newElement.x && e.y === newElement.y)) {
            xyDots.push(newElement);
          }
        }
      } else {
        if(element.x > fold.line){
          xyDots.splice(xyDots.findIndex(e => e === element), 1);
          const newElement = {x: 2 * fold.line - element.x, y: element.y};
          if(!xyDots.find(e => e.x === newElement.x && e.y === newElement.y)) {
            xyDots.push(newElement);
          }
        }


      }
    });

  }

  const minx = Math.min(...xyDots.map(xy => xy.x));
  const maxx = Math.max(...xyDots.map(xy => xy.x));
  const miny = Math.min(...xyDots.map(xy => xy.y));
  const maxy = Math.max(...xyDots.map(xy => xy.y));

  for (let y = miny; y <= maxy; y++){
    let currString = '';
    for (let x = minx; x <= maxx; x++){
      if(xyDots.find(xy => xy.x === x && xy.y === y)) {
        currString += '█';
        continue
      }
      currString += ' ';

    }
    console.log(currString);
  }
  const result = 0;
  // const result = xyDots.length;
  if (run === 'test') {
    return reRunWithInput(result, expectedTestResult, runner_star_two, '2');
  }
  console.log(`Star 2 - input result: ${result}`);

}
