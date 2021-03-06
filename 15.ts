import { readLines, reRunWithInput } from './helpers';
import fs from 'fs';
import os from 'os';

runner_star_one(40);
mapExpander();
mapExpander('input')

async function mapExpander(run = 'test', day = __filename.replace('.ts', '')) {
  const lines = await readLines(day, run);

  const smallMap: number[][] = [];

  lines.forEach((line) => {
    const items = line.split('').map(n => +n);
    smallMap.push([...items])
  });

  const maxX = smallMap[0].length;
  const maxY = smallMap.length;

  const fullMap: number[][] = [];
  let resultString = '';

  for (let y = 0; y < 5 * maxY; y++) {
    fullMap.push([]);
    for (let x = 0; x < 5 * maxX; x++) {
      const baseX = x % maxX;
      const baseY = y % maxY;
      const increaser = Math.floor(x / maxX) + Math.floor(y / maxY);
      let value = (smallMap[baseY][baseX] + increaser) % 10;
      if (smallMap[baseY][baseX] + increaser >= 10) {
        value++;
      }
      fullMap[y].push(value);
    }

    resultString += fullMap[y].join('') + '\n';
  }


  fs.unlinkSync('15_2.' + run);
  fs.writeFileSync('15_2.' + run, resultString, { flag: 'w+' });

  console.log('last result will be the star 2 result...')
  runner_star_one(315, run, '15_2')

}


async function runner_star_one(expectedTestResult: number, run = 'test', day = __filename.replace('.ts', '')) {
  // INIT
  const lines = await readLines(day, run);

  // LINES
  const allNodes: Node[] = [];
  let y = 0;
  let maxX = 0;

  lines.forEach((line) => {
    // Do something;

    const items = line.split('');
    maxX = items.length;
    for (let x = 0; x < items.length; x++) {
      const cost = +items[x];
      const node = new Node(x, y, cost);
      allNodes.push(node);
    }
    y++;
  });
  const maxY = allNodes.length / maxX;
  for (let x = 0; x < maxX; x++) {
    for (let y = 0; y < maxY; y++) {
      const thisNode = allNodes[x + maxX * y];

      if (x > 0) {
        thisNode.neighbors.push(allNodes[(x - 1) + maxX * y])
      }
      if (x < maxX - 1) {
        thisNode.neighbors.push(allNodes[(x + 1) + maxX * y])
      }
      if (y < maxY - 1) {
        thisNode.neighbors.push(allNodes[x + maxX * (y + 1)])
      }
      if (y > 0) {
        thisNode.neighbors.push(allNodes[x + maxX * (y - 1)])
      }
    }

  }

  const p = new PathFinder(allNodes[0], allNodes[allNodes.length - 1], maxX, allNodes);
  const res = p.explore();


  const result = res.reduce((a, b) => a + b.costToTravelTo, -res[0].costToTravelTo);

  if (run === 'test') {
    return reRunWithInput(result, expectedTestResult, runner_star_one);
  }
  console.log(`Star 1 - input result: ${result}`);

}


class Node {
  costToTravelTo: number;
  neighbors: Node[];
  // location: number;
  x: number; //
  y: number;

  constructor(x: number, y: number, costToTravelTo: number) {
    this.x = x;
    this.y = y;
    this.costToTravelTo = costToTravelTo;
    this.neighbors = [];
  }
}

//
class PathFinder {
  currentLowestCost = Number.MAX_SAFE_INTEGER;
  // startNode: Node;
  endNode: Node;
  gridWidth: number;
  // allNodes: Node[] ;

  openSet: Set<Node> = new Set();
  fScore: Map<Node, number> = new Map();
  gScore: Map<Node, number> = new Map();
  cameFrom: Map<Node, Node> = new Map();

  constructor(startNode: Node, endNode: Node, gridWidth: number, allNodes: Node[]) {
    this.openSet.add(startNode);
    this.endNode = endNode;

    this.gridWidth = gridWidth;

    // this.allNodes = [...allNodes]

    allNodes.forEach(n => {
      this.gScore.set(n, Number.MAX_SAFE_INTEGER);
      this.fScore.set(n, Number.MAX_SAFE_INTEGER);
    });

    this.gScore.set(startNode, 0);
    this.setFScore(startNode);
  }

  setFScore(node: Node) {
    const gridDistance = this.endNode.x - node.x + this.endNode.y - node.y;
    const gScore = this.gScore.get(node);
    if (gScore !== undefined) {
      this.fScore.set(node, gridDistance + gScore)
    } else {
      throw new Error('trying to get gscore but unset');

    }
    // this.fScore[node.x + this.gridWidth * node.y] = 5 * gridDistance;
  }

  explore(): Node[] {
    while (this.openSet.size > 0) {
      let currentNode: Node = new Node(-1, -1, -1);
      let currentMinFscore = Number.MAX_SAFE_INTEGER;
      // this.fScore.forEach((value, key) =>{
      //   if(value < currentMinFscore){
      //     currentNode = key;
      //     currentMinFscore = value
      //   }
      // });

      this.openSet.forEach(n => {
        const fScore = this.fScore.get(n);
        if (fScore !== undefined) {
          if (fScore < currentMinFscore) {
            currentMinFscore = fScore;
            currentNode = n;
          }
        }
      })

      if (!currentNode) {
        throw new Error('No currentnode');
      }

      if (currentNode === this.endNode) {
        return this.reconstruct_path(currentNode)
      }

      this.openSet.delete(currentNode);

      currentNode.neighbors.forEach(nb => {
        const gScore = this.gScore.get(currentNode);
        if (gScore === undefined) {
          throw new Error('no gscore');

        }
        const tentative_gScore = gScore + nb.costToTravelTo;
        const neigborGscore = this.gScore.get(nb);
        if (neigborGscore === undefined) {
          throw new Error('no neighbor gscore');

        }
        if (tentative_gScore < neigborGscore) {
          this.cameFrom.set(nb, currentNode);
          this.gScore.set(nb, tentative_gScore);
          this.setFScore(nb);
          if (!this.openSet.has(nb)) {
            this.openSet.add(nb);
          }
        }
      });
    }

    return [];
  }

  reconstruct_path(node: Node) {
    const path: Node[] = [];
    path.push(node);
    let currNode = node;

    while (this.cameFrom.get(currNode) !== undefined) {
      const cf = this.cameFrom.get(currNode);
      if (cf) {
        currNode = cf;
        path.push(currNode);
      }
    }

    return path.reverse();
  }
}
