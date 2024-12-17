const text = await Deno.readTextFile('08/input.txt');
// const text = await Deno.readTextFile('08/example.txt');
const area = text.split('\n').map((row) => row.split(''));
const frequencies = Array.from(
  new Set(area.flat().filter((value) => value !== '.')),
);

function findLocations(frequency: string) {
  const results = [];
  for (let x = 0; x < area.length; x++) {
    for (let y = 0; y < area[x].length; y++) {
      if (area[x][y] === frequency) {
        results.push({
          x,
          y,
        });
      }
    }
  }
  return results;
}

function getAntinodes(
  points: { x: number; y: number }[],
  _map: string[][],
  resonant: boolean = false,
) {
  const antinodes = [];
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const point1 = points[i];
      const point2 = points[j];
      const dx = point1.x - point2.x;
      const dy = point1.y - point2.y;

      let multiplier = 1;

      while (true) {
        const x1 = point1.x + dx * multiplier;
        const y1 = point1.y + dy * multiplier;

        antinodes.push({
          x: x1,
          y: y1,
        });

        const x2 = point2.x - dx * multiplier;
        const y2 = point2.y - dy * multiplier;

        antinodes.push({
          x: x2,
          y: y2,
        });

        if (
          (x1 < 0 || x1 >= _map.length || y1 < 0 || y1 >= _map[0].length) &&
          (x2 < 0 || x2 >= _map.length || y2 < 0 || y2 >= _map[0].length)
        ) {
          break;
        }
        if (!resonant) {
          break;
        }
        multiplier++;
      }

      // let multiplier = 1;
      // while (true) {
      //   const x1 = point1.x + dx * multiplier;
      //   const y1 = point1.y + dy * multiplier;
      //   if (x1 < 0 || x1 >= _map.length || y1 < 0 || y1 >= _map[0].length) {
      //     break;
      //   }
      //   antinodes.push({
      //     x: x1 + dx,
      //     y: y1 + dy,
      //   });

      //   const x2 = point2.x - dx * multiplier;
      //   const y2 = point2.y - dy * multiplier;
      //   if (x2 < 0 || x2 >= _map.length || y2 < 0 || y2 >= _map[0].length) {
      //     break;
      //   }
      //   antinodes.push({
      //     x: x2 - dx,
      //     y: y2 - dy,
      //   });
      //   if (!resonant) {
      //     break;
      //   }
      //   multiplier++;
      // }
    }
  }
  return antinodes.filter((node) => {
    return (
      node.x >= 0 &&
      node.x < _map.length &&
      node.y >= 0 &&
      node.y < _map[0].length
      // _map[node.x][node.y] === '.'
    );
  });
}

function part1Map(_map: string[][]) {
  const map = [..._map.map((row) => [...row])];
  frequencies.forEach((frequency) => {
    const locations = findLocations(frequency);
    const antinodes = getAntinodes(locations, _map);
    antinodes.forEach((node) => {
      map[node.x][node.y] = '#';
    });
  });
  return map;
}

console.log(
  part1Map(area).reduce((prev, acc) => {
    return prev + acc.filter((value) => value === '#').length;
  }, 0),
);

// part2
function part2Map(_map: string[][]) {
  const map = [..._map.map((row) => [...row])];
  frequencies.forEach((frequency) => {
    const locations = findLocations(frequency);
    const antinodes = getAntinodes(locations, _map, true);
    antinodes.forEach((node) => {
      map[node.x][node.y] = '#';
    });
  });
  return map;
}

console.log(
  part2Map(area).reduce((prev, acc) => {
    return prev + acc.filter((value) => value !== '.').length;
  }, 0),
);
