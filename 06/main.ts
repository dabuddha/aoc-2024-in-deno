const text = await Deno.readTextFile('06/input.txt');
const originalArea = text.split('\n').map((row) => row.split(''));

const turnRight = (
  dx: number,
  dy: number,
): {
  dx: number;
  dy: number;
} => {
  if (dx === -1) {
    return { dx: 0, dy: 1 };
  } else if (dx === 1) {
    return { dx: 0, dy: -1 };
  } else if (dy === -1) {
    return { dx: -1, dy: 0 };
  } else {
    return { dx: 1, dy: 0 };
  }
};

const part1 = (
  area: string[][],
  start: { x: number; y: number },
  d: { x: number; y: number },
) => {
  const pos = start;
  const delta = d;

  while (
    area[pos.x] !== undefined &&
    area[pos.x][pos.y] !== undefined &&
    area[pos.x + delta.x] !== undefined &&
    area[pos.x + delta.x][pos.y + delta.y] !== undefined
  ) {
    area[pos.x][pos.y] = 'X';
    if (area[pos.x + delta.x][pos.y + delta.y] === '#') {
      const { dx, dy } = turnRight(delta.x, delta.y);
      delta.x = dx;
      delta.y = dy;
    } else {
      pos.x += delta.x;
      pos.y += delta.y;
    }
  }

  return area.reduce((prev, row) => {
    return prev + row.filter((cell) => cell === 'X').length;
  }, 1);
};

let locX = 0;
let locY = 0;

for (let x = 0; x < originalArea.length; x++) {
  for (let y = 0; y < originalArea[x].length; y++) {
    if (originalArea[x][y] === '^') {
      locX = x;
      locY = y;
    }
  }
}

console.log(part1(originalArea, { x: locX, y: locY }, { x: -1, y: 0 }));

const hasLoop = (
  area: string[][],
  start: { x: number; y: number },
  d: { x: number; y: number },
) => {
  const pos = { ...start };
  const delta = { ...d };
  const route: Map<string, string[]> = new Map();

  let result = false;
  while (
    area[pos.x] !== undefined &&
    area[pos.x][pos.y] !== undefined &&
    area[pos.x + delta.x] !== undefined &&
    area[pos.x + delta.x][pos.y + delta.y] !== undefined
  ) {
    if (route.has(`${pos.x},${pos.y}`)) {
      if (route.get(`${pos.x},${pos.y}`)!.includes(`${delta.x},${delta.y}`)) {
        result = true;
        break;
      } else {
        route.get(`${pos.x},${pos.y}`)!.push(`${delta.x},${delta.y}`);
      }
    } else {
      route.set(`${pos.x},${pos.y}`, [`${delta.x},${delta.y}`]);
    }

    area[pos.x][pos.y] = 'X';
    if (area[pos.x + delta.x][pos.y + delta.y] === '#') {
      const { dx, dy } = turnRight(delta.x, delta.y);
      delta.x = dx;
      delta.y = dy;
    } else {
      pos.x += delta.x;
      pos.y += delta.y;
    }
  }
  return result;
};

const part2 = (
  _area: string[][],
  start: { x: number; y: number },
  d: { x: number; y: number },
) => {
  const pos = start;
  const delta = d;
  const area = [..._area.map((row) => [...row])];
  const records: string[] = [];
  let chance = 0;

  while (
    area[pos.x] !== undefined &&
    area[pos.x][pos.y] !== undefined &&
    area[pos.x + delta.x] !== undefined &&
    area[pos.x + delta.x][pos.y + delta.y] !== undefined
  ) {
    area[pos.x][pos.y] = 'X';
    if (area[pos.x + delta.x][pos.y + delta.y] === '#') {
      const { dx, dy } = turnRight(delta.x, delta.y);
      delta.x = dx;
      delta.y = dy;
    } else {
      if (!records.includes(`${pos.x + delta.x},${pos.y + delta.y}`)) {
        const newArea = [...area.map((row) => [...row])];
        newArea[pos.x + delta.x][pos.y + delta.y] = '#';
        records.push(`${pos.x + delta.x},${pos.y + delta.y}`);
        if (hasLoop(newArea, pos, delta)) {
          chance++;
        }
      }
      pos.x += delta.x;
      pos.y += delta.y;
    }
  }
  return chance;
};

console.log(part2(originalArea, { x: locX, y: locY }, { x: -1, y: 0 }));
