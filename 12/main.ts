const text = await Deno.readTextFile('12/input.txt');
const ground = text.split('\n').map((line) => line.split(''));

const map = Array.from({ length: ground.length }, () =>
  Array.from({ length: ground[0].length }, () => 0),
);

function drawMap(
  map: number[][],
  current: { x: number; y: number },
  mark: number = 1,
) {
  const value = ground[current.x][current.y];
  map[current.x][current.y] = mark;
  const surroudings = [
    { x: current.x - 1, y: current.y },
    { x: current.x + 1, y: current.y },
    { x: current.x, y: current.y - 1 },
    { x: current.x, y: current.y + 1 },
  ].filter((point) => {
    return (
      point.x >= 0 &&
      point.x < map.length &&
      point.y >= 0 &&
      point.y < map[0].length
    );
  });
  surroudings
    .filter((p) => {
      return ground[p.x][p.y] === value && map[p.x][p.y] === 0;
    })
    .forEach((point) => {
      drawMap(map, point, mark);
    });
}

let mark = 0;
while (true) {
  let target = { x: -1, y: -1 };
  for (let x = 0; x < map.length; x++) {
    for (let y = 0; y < map[x].length; y++) {
      if (map[x][y] === 0) {
        target = { x, y };
      }
    }
  }
  if (target.x === -1) {
    break;
  }
  mark += 1;
  drawMap(map, target, mark);
}

function getPerimeter(points: { x: number; y: number }[]): number {
  if (points.length === 0) {
    return 0;
  }
  if (points.length === 1) {
    return 4;
  }
  const first = points[0];
  const surroudings = [
    { x: first.x - 1, y: first.y },
    { x: first.x + 1, y: first.y },
    { x: first.x, y: first.y - 1 },
    { x: first.x, y: first.y + 1 },
  ].filter((point) => {
    return points.some((p) => p.x === point.x && p.y === point.y);
  });
  if (surroudings.length === 0) {
    return 4 + getPerimeter(points.slice(1));
  }
  if (surroudings.length === 1) {
    return 2 + getPerimeter(points.slice(1));
  }
  if (surroudings.length === 2) {
    return getPerimeter(points.slice(1));
  }
  if (surroudings.length === 3) {
    return getPerimeter(points.slice(1)) - 2;
  }
  if (surroudings.length === 4) {
    return getPerimeter(points.slice(1)) - 4;
  }
  return 0;
}

function calculateMap(
  map: number[][],
  weight: (points: { x: number; y: number }[]) => number,
): number {
  let mark = 1;
  let result = 0;
  while (true) {
    const points: { x: number; y: number }[] = [];
    for (let x = 0; x < map.length; x++) {
      for (let y = 0; y < map[x].length; y++) {
        if (map[x][y] === mark) {
          points.push({ x, y });
        }
      }
    }
    if (points.length === 0) {
      break;
    }
    // console.log(`mark: ${mark}`);
    const v = weight(points);
    // console.log(`${v} * ${points.length} = ${v * points.length}`);
    result += v * points.length;
    mark += 1;
  }
  return result;
}

function getEmptyInsides(
  points: { x: number; y: number }[],
): { x: number; y: number }[][] {
  const minX = Math.min(...points.map((p) => p.x));
  const maxX = Math.max(...points.map((p) => p.x));
  const minY = Math.min(...points.map((p) => p.y));
  const maxY = Math.max(...points.map((p) => p.y));
  const insides: { x: number; y: number }[] = [];

  let exclude: Set<string> = new Set();
  function isInside(
    target: { x: number; y: number },
    points: { x: number; y: number }[],
  ): boolean {
    const ys = points.filter((p) => p.x === target.x).map((p) => p.y);
    const xs = points.filter((p) => p.y === target.y).map((p) => p.x);
    const xprev = Math.max(...xs.filter((x) => x < target.x));
    const xnext = Math.min(...xs.filter((x) => x > target.x));
    const yprev = Math.max(...ys.filter((y) => y < target.y));
    const ynext = Math.min(...ys.filter((y) => y > target.y));

    if (
      xprev === -Infinity ||
      xnext === Infinity ||
      yprev === -Infinity ||
      ynext === Infinity
    ) {
      return false;
    }

    const newPoints = [
      ...Array.from({ length: xnext - xprev - 1 }, (_, i) => {
        const x = xprev + i + 1;
        return { x, y: target.y };
      }),
      ...Array.from({ length: ynext - yprev - 1 }, (_, i) => {
        const y = yprev + i + 1;
        return { x: target.x, y };
      }),
    ].filter((p) => {
      return (
        (p.x !== target.x || p.y !== target.y) && !exclude.has(`${p.x}-${p.y}`)
      );
    });

    if (newPoints.length === 0) {
      return true;
    }
    newPoints.forEach((p) => {
      exclude.add(`${p.x}-${p.y}`);
    });
    return newPoints.reduce((prev, cur) => {
      return prev && isInside(cur, points);
    }, true);
  }

  for (let x = minX + 1; x < maxX; x++) {
    for (let y = minY + 1; y < maxY; y++) {
      if (!points.some((p) => p.x === x && p.y === y)) {
        const y_points = points.filter((p) => p.x === x);
        const x_points = points.filter((p) => p.y === y);
        const min_x = Math.min(...x_points.map((p) => p.x));
        const max_x = Math.max(...x_points.map((p) => p.x));
        const min_y = Math.min(...y_points.map((p) => p.y));
        const max_y = Math.max(...y_points.map((p) => p.y));
        if (min_x < x && x < max_x && min_y < y && y < max_y) {
          exclude = new Set();
          if (isInside({ x, y }, points)) {
            insides.push({ x, y });
          }
        }
      }
    }
  }

  if (insides.length === 0) {
    return [];
  }
  const map: Map<string, number> = new Map();
  function drawMapValue(current: { x: number; y: number }, mark: number) {
    map.set(`${current.x}-${current.y}`, mark);
    const surroudings = [
      { x: current.x - 1, y: current.y },
      { x: current.x + 1, y: current.y },
      { x: current.x, y: current.y - 1 },
      { x: current.x, y: current.y + 1 },
    ].filter((point) => {
      return (
        insides.some((p) => p.x === point.x && p.y === point.y) &&
        !map.has(`${point.x}-${point.y}`)
      );
    });
    surroudings.forEach((point) => {
      drawMapValue(point, mark);
    });
  }
  let mark = 1;
  while (true) {
    const others = insides.filter((p) => {
      return !map.has(`${p.x}-${p.y}`);
    });
    if (others.length > 0) {
      drawMapValue(others[0], mark);
    } else {
      break;
    }
    mark += 1;
  }
  drawMapValue(insides[0], 1);
  const values = Array.from(new Set(map.values()));
  const ret = values.map((v) => {
    return Array.from(map.keys())
      .filter((k) => map.get(k) === v)
      .map((k) => {
        const pair = k.split('-').map((i) => parseInt(i, 10));
        return { x: pair[0], y: pair[1] };
      });
  });
  return ret;
}

function getEdgesCount(points: { x: number; y: number }[]): number {
  const turnRight = (d: [number, number]): [number, number] => {
    const [dx, dy] = d;
    if (dx === 0) {
      return [dy, dx];
    }
    return [-dy, -dx];
  };
  const minX = Math.min(...points.map((p) => p.x));
  const start = { x: minX, y: points.find((p) => p.x === minX)!.y };
  const startD: [number, number] = [0, 1];
  function getEdgeCount(
    start: { x: number; y: number },
    startD: [number, number],
  ) {
    let d: [number, number] = [0, 1];
    let current = { x: start.x, y: start.y };
    let edges = 1;
    while (true) {
      const [dx, dy] = d;
      const vdx = dx === 0 ? -dy : 0;
      const vdy = dy === 0 ? dx : 0;
      const next = { x: current.x + dx, y: current.y + dy };
      const vnext = { x: next.x + vdx, y: next.y + vdy };
      if (points.findIndex((p) => p.x === next.x && p.y === next.y) === -1) {
        if (
          points.findIndex((p) => p.x === vnext.x && p.y === vnext.y) !== -1
        ) {
          d = [vdx, vdy];
          current = vnext;
          edges += 1;
        } else {
          edges += 1;
          d = turnRight(d);
        }
      } else {
        if (
          points.findIndex((p) => p.x === vnext.x && p.y === vnext.y) === -1
        ) {
          current = next;
        } else {
          d = [vdx, vdy];
          current = vnext;
          edges += 1;
        }
      }
      if (
        current.x === start.x &&
        current.y === start.y &&
        d[0] === startD[0] &&
        d[1] === startD[1]
      ) {
        break;
      }
    }
    return edges - 1;
  }
  const outside = getEdgeCount(start, startD);
  if (getEmptyInsides(points).length !== 0) {
    const insides = getEmptyInsides(points);
    return (
      outside +
      insides
        .map((inside) => getEdgesCount(inside))
        .reduce((prev, cur) => prev + cur, 0)
    );
  }
  return outside;
}

console.log(calculateMap(map, getPerimeter));
console.log(calculateMap(map, getEdgesCount));
