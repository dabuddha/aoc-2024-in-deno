function isSafe(levels: number[]) {
  const orderCheck =
    levels.every((val, i, arr) => !i || arr[i - 1] < val) ||
    levels.every((val, i, arr) => !i || arr[i - 1] > val);
  const distanceCheck = levels.every(
    (val, i, arr) => !i || Math.abs(arr[i - 1] - val) <= 3,
  );
  return orderCheck && distanceCheck;
}

// part1
const text = await Deno.readTextFile('./02/input.txt');
const lines: number[][] = [];
text.split('\n').forEach((line) => {
  const levels = line.split(' ');
  lines.push(levels.map(Number));
});

const safeCount = lines.filter(isSafe).length;
console.log(safeCount);

// part2

const unsafeLines = lines.filter((line) => !isSafe(line));
const safeAfterRemoving = unsafeLines.filter((line) => {
  let result = false;
  for (let i = 0; i < line.length; i++) {
    const levels = [...line];
    levels.splice(i, 1);
    if (isSafe(levels)) {
      result = true;
    }
  }
  return result;
});

console.log(safeAfterRemoving.length + safeCount);
