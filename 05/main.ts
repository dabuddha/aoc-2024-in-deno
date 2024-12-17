const text = await Deno.readTextFile('./05/input.txt');
const [section1, section2] = text.split('\n\n');
const maps = section1.split('\n').map((line) => line.split('|'));
const lines = section2
  .split('\n')
  .map((line) => line.split(',').map((value) => Number(value)));

const requirements = new Map<number, number[]>();
maps.forEach((map) => {
  const [key, value] = map;
  if (requirements.has(Number(key))) {
    requirements.set(Number(key), [
      ...requirements.get(Number(key))!,
      Number(value),
    ]);
  } else {
    requirements.set(Number(key), [Number(value)]);
  }
});

const correctLines = lines.filter((line) => {
  return line.every((value, index, arr) => {
    if (index === 0) {
      return true;
    }
    return arr.slice(0, index).every((v) => {
      return !requirements.get(value)?.includes(v);
    });
  });
});

console.log(
  correctLines.reduce(
    (prev, line) => prev + line[Math.floor(line.length / 2)],
    0,
  ),
);

// Part 2

const wrongLines = lines.filter((line) => {
  return !line.every((value, index, arr) => {
    if (index === 0) {
      return true;
    }
    return arr.slice(0, index).every((v) => {
      return !requirements.get(value)?.includes(v);
    });
  });
});

const updatedLines = wrongLines.map((line) => {
  const newLine: number[] = [];
  line.forEach((value, index) => {
    if (index === 0) {
      newLine.push(value);
    } else {
      const idx = newLine.findIndex((v) => {
        return requirements.get(value)?.includes(v);
      });
      if (idx === -1) {
        newLine.push(value);
      } else {
        newLine.splice(idx, 0, value);
      }
    }
  });
  return newLine;
});

console.log(
  updatedLines.reduce(
    (prev, line) => prev + line[Math.floor(line.length / 2)],
    0,
  ),
);
