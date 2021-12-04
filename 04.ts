import {readLines, reRunWithInput} from './helpers';

runner_star_one(4512, 'test');
// runner_star_one(4152, 'input');

// runner_star_two(5);

async function runner_star_one(expectedTestResult: number, run = 'test', day = __filename.replace('.ts', '')) {
  // INIT
  const lines = await readLines(day, run);
  let result = 0;

  // LINES

  const bingoValues = lines[0].split(',').map(v => +v);

  let currentBoard: Board = new Board();
  const boards: Array<Board> = []

  let counter = 0;
  for (let i = 1; i < lines.length; i++) {
    if(counter % 6 === 0) {
      currentBoard = new Board();
      boards.push(currentBoard);
      counter++;
      continue;
    }

    currentBoard.addRow(lines[i]);
    counter++;
  }

  for (let i = 0; i < bingoValues.length; i++) {
    result = boards.map(b => b.check(bingoValues[i])).reduce((a, c) => a + c, 0);
    if(result > 0) {
      break;
    }
  }

  if (run === 'test') {
    reRunWithInput(result, expectedTestResult, runner_star_one);
  } else{
    console.log(`Star 1 - input result: ${result}`);
  }
}

class Board {
  private _rows: Array<BoardRowCol> = [];
  private _colums: Array<BoardRowCol> = [];

  /**
   *
   */
  constructor() {
    for (let i = 0; i < 5; i++) {
      this._colums.push(new BoardRowCol());
    }
  }

  addRow(row: string){
    this._rows.push(new BoardRowCol());
    const values = row.trim().replace(/\s+/g, ' ').split(' ').map(v => +v);
    for (let i = 0; i < 5; i++) {
      // const val = this._rows[this._rows.length - 1];
      this._rows[this._rows.length - 1].push(values[i]);
      this._colums[i].push(values[i]);
    }
  }

  public check(val: number): number{
    // const won = false;
    // if(val === 24) {
    //   console.log('debug');
    // }
    // Fill in the number and see if any row is a winner
    const won_rows = this._rows.map(e => e.check(val)).some(e => e === true);
    const won_cols = this._colums.map(e => e.check(val)).some(e => e === true);
    if(won_rows || won_cols) {
      return this.unMarkedSum() * val;
    }
    return 0;
  }

  private unMarkedSum(): number {
    return this._rows.map(r => r.unMarkedSum()).reduce((acc, cur) => acc + cur, 0);
  }

}

class BoardRowCol {
  private _values : Array<BoardValue> = [];

  public push(value: number){
    this._values.push(new BoardValue(value));
  }

  public check(val: number): boolean{
    this._values.map(e => e.check(val));
    return this.hasWon();
  }

  hasWon(): boolean {
    return this._values.every(e => e.marked === true);
  }

  unMarkedSum(): number {
    let sum = 0;
    this._values.forEach(bv => {
      if(!bv.marked) {
        sum += bv.value
      }
    });
    return sum;
  }
}

class BoardValue {
  private _marked = false;
  public get marked() {
    return this._marked;
  }

  private _value: number;
  public get value(): number {
    return this._value;
  }

  constructor(value: number) {
    this._value = value;
  }

  public check(checkVal: number){
    if(checkVal === this.value){
      this._marked = true;
    }
  }
}

// async function runner_star_two(expectedTestResult: number, run = 'test', day = __filename.replace('.ts', '')) {
//   // INIT
//   const lines = await readLines(day, run);
//   const result = 0;

//   // LINES

//   lines.forEach((line) => {
//     // Do something;
//   });


//   if (run === 'test') {
//     return reRunWithInput(result, expectedTestResult, runner_star_two);
//   }
//   console.log(`Star 2 - input result: ${result}`);
// }
