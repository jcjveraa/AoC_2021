import {readLines, reRunWithInput} from './helpers';

runner_star_one(19);
runner_star_one(103);


async function runner_star_one(expectedTestResult: number, run = 'test', day = __filename.replace('.ts', '')) {
  // INIT
  const lines = await readLines(day, run);
  const caveSystem: CaveSystem = new CaveSystem();
  // LINES

  lines.forEach((line) => {
    caveSystem.addCavePair(line);
  });

  caveSystem.explore(1);
  let result = caveSystem.paths.filter(p => p.currentCave.name === 'end').length;

  console.log(`--- Note the results are correct, but no time to clean up code to have it print correctly ---`);
  if (run === 'test') {
    return reRunWithInput(result, expectedTestResult, runner_star_one);
  }
  console.log(`Star 1 - input result: ${result}`);

  caveSystem.explore(2);
  result = caveSystem.paths.filter(p => p.currentCave.name === 'end').length;

  if (run === 'test') {
    return reRunWithInput(result, expectedTestResult, runner_star_one, '2');
  }
  console.log(`Star 2 - input result: ${result}`);

}

class CaveSystem {
  caves: Cave[] = [];
  paths: Path[] = [];

  public explore(smallCaveVisits = 1) {
    const startCave = this.caves.find(c => c.name === 'start');
    if(startCave) {
      this.paths.push(new Path(startCave));
    }

    while(this.paths.some(p => !p.pathComplete)) {
      const newPaths: Path[] = [];
      this.paths.forEach(path => {
        if(!path.pathComplete){
          newPaths.push(...path.traverse(smallCaveVisits));
        }
      })

      this.paths.push(...newPaths);
    }
  }

  public addCavePair(cavePair: string){
    const names = cavePair.split('-');
    let cave1 = this.caves.find(c => c.name === names[0]);
    let cave2 = this.caves.find(c => c.name === names[1]);

    if(!cave1) {
      cave1 = new Cave(names[0]);
      this.caves.push(cave1);
    }

    if(!cave2) {
      cave2 = new Cave(names[1]);
      this.caves.push(cave2);
    }

    cave1.connectCaves(cave2);
  }
}

class Cave {
  name: string;
  private _connections: Cave[];
  public get connectedCaves(): Cave[] {
    return this._connections;
  }

  public connectCaves(cave: Cave) {
    if(!this._connections.includes(cave)) {
      this._connections.push(cave);
      cave.connectCaves(this);
    }
  }

  public get bigCave() : boolean {
    return this.name.toUpperCase() === this.name;
  }

  constructor(name: string) {
    this._connections = [];
    this.name = name;
  }
}

class Path {
  cavesVisited: Cave[];
  currentCave: Cave;
  pathComplete = false;

  constructor(currentCave: Cave, cavesVisited: Cave[] = []){
    // this.cavesVisited = cavesVisited;
    this.currentCave = currentCave;
    this.cavesVisited = cavesVisited;
  }

  moveTo(cave: Cave){
    this.cavesVisited.push(this.currentCave);
    this.currentCave = cave;
    if(cave.name === 'end'){
      this.pathComplete = true;
    }
  }

  traverse(smallCaveVisits = 1): Path[] {
    const out: Path[] = [];
    if(this.pathComplete){
      throw new Error('Trying to traverse a completed path...');
    }

    // Any big cave is OK, and any small cave not already visited
    // const nextCaves = this.currentCave.connections.filter(c => c.bigCave || !this.cavesVisited.includes(c));
    let nextCaves: Cave[] = []
    // Any big cave is OK, and any small cave not already visited smallCaveVisits-times
    if(smallCaveVisits === 1) {
      nextCaves = this.currentCave.connectedCaves.filter(c => {
        return c.name !== 'start' &&
      (c.bigCave || this.cavesVisited.filter(cave => c === cave).length < smallCaveVisits)
      });
    }

    if(smallCaveVisits === 2) {
      nextCaves = this.currentCave.connectedCaves.filter(c => {
        return c.name !== 'start' &&
      (c.bigCave || this.noSmallCaveDuplicates(c))
      });
    }

    if(nextCaves.length === 0) {
      this.pathComplete = true;
      return out;
    }
    for (let i = 1; i < nextCaves.length; i++) {
      const branch = new Path(this.currentCave, [...this.cavesVisited]);
      // branch.cavesVisited = this.cavesVisited;
      branch.moveTo(nextCaves[i]);
      out.push(branch);
    }

    this.moveTo(nextCaves[0]);

    return out;

  }


  private noSmallCaveDuplicates(cave: Cave): boolean {
    const smallCaves = [];
    smallCaves.push(cave);
    smallCaves.push(this.currentCave);
    smallCaves.push(...this.cavesVisited.filter(cave => !cave.bigCave))
    const distinctSmallCaves = new Set(smallCaves);
    return (smallCaves.length - distinctSmallCaves.size) <= 1;
  }
}
