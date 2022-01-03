const test_input = 'target area: x=20..30, y=-10..-5';
const input = 'target area: x=207..263, y=-115..-63';

console.log('mostly brute force on this one for now');

console.log('test');
solve(test_input);
console.log('input');
solve(input);

function solve(input: string){
  const targetArea = parseInput(input);

  simulate(7, 2, targetArea);
  // const rest = calcMinXSpeed(20);

  let maxY = 0;
  let validResults = 0;
 
  for (let xSpeed = calcMinXSpeed(targetArea.xMin); xSpeed < targetArea.xMax+1; xSpeed++) {
    for (let ySpeed = targetArea.yMin; ySpeed < 10000; ySpeed++) {
      const yResult = simulate(xSpeed, ySpeed, targetArea);
      if(yResult) {
        validResults++;
        if(maxY < yResult){
          maxY = yResult;
        }
      }
      
    }      
  }

  console.log(maxY, validResults);

}

function calcMinXSpeed(minXTarget: number) {

  let result = 0;
  while(true){
    if(sumUpTo(result) > minXTarget){
      return result;
    }
    result++;
  }
}

function sumUpTo(n: number){
  return n*(n+1)/2;
}

function simulate (xSpeed: number, ySpeed: number, targetArea: TargetArea) {

  let x = 0;
  let y = 0;
  let t = 1;
  let maxY = 1;

  while(x < targetArea.xMax && y > targetArea.yMin) {
    x = x + xSpeed;
    if(xSpeed > 0){
      xSpeed--;
    }

    y = y+ ySpeed;
    ySpeed--;

    if(checkHit(x,y, targetArea)) {
      return maxY;
    }

    t++;

    if(y > maxY){
      maxY = y;
    }
  }

  return false;  
}


function checkHit(x: number, y: number, targetArea: TargetArea ){
  return x >= targetArea.xMin && x <= targetArea.xMax && y >= targetArea.yMin && y <= targetArea.yMax
}


function parseInput(input: string): TargetArea{
  input = input.replace('target area: ','')
  const xy = input.split(', ')
  const x_range = xy[0].split('..').map(a => +a.replace('x=', ''));
  const y_range = xy[1].split('..').map(a => +a.replace('y=', ''));

  const targetArea = {xMin: Math.min(...x_range),xMax: Math.max(...x_range), yMax: Math.max(...y_range), yMin: Math.min(...y_range)};
 
  return targetArea;
}

interface TargetArea {xMin: number,xMax: number, yMax: number, yMin: number}

