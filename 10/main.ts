const text = await Deno.readTextFile('10/input.txt');
const map = text.split('\n').map((line) =>
  line.split('').map((char) => {
    return parseInt(char, 10);
  }),
);

const targets: {
  x: number;
  y: number;
}[] = [];

for (let x = 0; x < map.length; x++) {
  for (let y = 0; y < map[x].length; y++) {
    if (map[x][y] === 0) {
      targets.push({ x, y });
    }
  }
}

function getNextPoint(map: number[][], point: { x: number; y: number }) {
  const points = [
    { x: point.x - 1, y: point.y },
    { x: point.x + 1, y: point.y },
    { x: point.x, y: point.y - 1 },
    { x: point.x, y: point.y + 1 },
  ];

  return points.filter(
    (p) =>
      p.x >= 0 &&
      p.x < map.length &&
      p.y >= 0 &&
      p.y < map[0].length &&
      map[p.x][p.y] === map[point.x][point.y] + 1,
  );
}

// PART 1
console.log(
  targets
    .map((target) => {
      let points = [target];
      while (true) {
        points = points.map((point) => getNextPoint(map, point)).flat();
        points = Array.from(new Set(points.map((p) => JSON.stringify(p)))).map(
          (p) => JSON.parse(p),
        );
        if (points.length === 0) {
          break;
        }
        if (map[points[0].x][points[0].y] === 9) {
          break;
        }
      }
      return points.length;
    })
    .reduce((prev, cur) => prev + cur, 0),
);

// PART 2
console.log(
  targets
    .map((target) => {
      let points = [target];
      while (true) {
        points = points.map((point) => getNextPoint(map, point)).flat();
        if (points.length === 0) {
          break;
        }
        if (map[points[0].x][points[0].y] === 9) {
          break;
        }
      }
      return points.length;
    })
    .reduce((prev, cur) => prev + cur, 0),
);
