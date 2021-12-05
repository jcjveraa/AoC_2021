import fs from 'fs';

import readline from 'readline'

// test();

async function test() {
  const lines = await readLines('01', 'test');
  lines.forEach((line) => console.log(line));
}

export async function readLines(day: string, run: string): Promise<string[]> {
  const lines: string[] = [];
  const result: Promise<string[]> = new Promise<string[]>((resolve) => {
    const lineReader = readline.createInterface({
      input: fs.createReadStream(`${day}.${run}`)
    });

    lineReader.on('line', function(line) {
      lines.push(line);
    });

    lineReader.on('close', () => {
      resolve(lines);
    });
  })

  return result;
}

export function reRunWithInput(result: number, expectedTestResult: number, runner: (a: number, b: string) => void, star = '1'):void{

  console.log(`Star ${star} - test result: ${result}, expected was: ${expectedTestResult}`);
  if (result === expectedTestResult) {
    runner(-1, 'input');
  }
}

export function twoDArray(maxX: number, maxY: number, plusOne = true): number[][] {
  if(plusOne){
    maxX++;
    maxY++;
  }
  const arr: number[][] = [];

  for (let i = 0; i < maxX; i++) {
    arr.push([]);
    for (let j = 0; j < maxY; j++) {
      arr[i].push(0);
    }
  }

  return arr;
}
