import { readLines, reRunWithInput } from './helpers';

runner_star_one(58);

enum SquareType {
  RIGHT, DOWN, EMPTY
}

async function runner_star_one(expectedTestResult: number, run = 'test', day = __filename.replace('.ts', '')) {
  // INIT
  const lines = await readLines(day, run);
  const maxX = lines[0].length;
  const maxY = lines.length;
  // LINES

  const currentBoardPositions: SquareType[][] = [];
  const nextBoardPositions: SquareType[][] = [];

  lines.forEach((line) => {
    const values = line.split('').map(a => {
      switch (a) {
        case '>':
          return SquareType.RIGHT
        case '.':
          return SquareType.EMPTY
        case 'v':
          return SquareType.DOWN

        default:
          throw new Error("Incorrect type found");

      }
    }
    );
    currentBoardPositions.push([...values])
    nextBoardPositions.push([...values])
  });


  let couldMove = true;
  let iterationCounter = 0

  while (couldMove) {
    // printBoard(currentBoardPositions, maxX, maxY)
    couldMove = false;
    let moveRightNotDown = true;

    for (let i = 0; i < 2; i++) {
      for (let y = 0; y < maxY; y++) {
        for (let x = 0; x < maxX; x++) {
          const element = currentBoardPositions[y][x];
          if (element === SquareType.EMPTY) {
            continue;

          }

          if (moveRightNotDown && element === SquareType.RIGHT) {
            const nextPosition = currentBoardPositions[y][(x + 1) % maxX];
            if (nextPosition === SquareType.EMPTY) {
              nextBoardPositions[y][x] = SquareType.EMPTY;
              nextBoardPositions[y][(x + 1) % maxX] = SquareType.RIGHT;
              couldMove = true;
            }
          }

          if (!moveRightNotDown && element === SquareType.DOWN) {
            const nextPosition = currentBoardPositions[(y + 1) % maxY][x];
            if (nextPosition === SquareType.EMPTY) {
              nextBoardPositions[y][x] = SquareType.EMPTY;
              nextBoardPositions[(y + 1) % maxY][x] = SquareType.DOWN;
              couldMove = true;
            }
          }
        }
      }
      for (let x = 0; x < maxX; x++) {
        for (let y = 0; y < maxY; y++) {
          currentBoardPositions[y][x] = nextBoardPositions[y][x];
        }
      }
      moveRightNotDown = false;
    } 
    iterationCounter++;
    // printBoard(currentBoardPositions, maxX, maxY);
  }


  const result = iterationCounter ;

  if (run === 'test') {
    return reRunWithInput(result, expectedTestResult, runner_star_one);
  }
  console.log(`Star 1 - input result: ${result}`);

}


function printBoard(board: SquareType[][], maxX: number, maxY: number) {
  let logString = ''

  for (let y = 0; y < maxY; y++) {
    logString = '';
    for (let x = 0; x < maxX; x++) {

      switch (board[y][x]) {
        case SquareType.DOWN:
          logString += 'v';
          break;
        case SquareType.RIGHT:
          logString += '>';
          break;
        case SquareType.EMPTY:
          logString += '.';
          break;

        default:
          break;
      }
    }
    console.log(logString);

  }
  console.log('');
}