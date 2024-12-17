const lines: number[][] = [[], []];
const text = await Deno.readTextFile('./01/input.txt');
text.split('\n').forEach((line) => {
  const [a, b] = line.split('   ').map(Number);
  if (a !== undefined && b !== undefined) {
    lines[0].push(a);
    lines[1].push(b);
  }
});

lines.map((line) => {
  return line.sort((a, b) => a - b);
});
let part1 = 0;
for (let i = 0; i < lines[0].length; i++) {
  const a = lines[0][i];
  const b = lines[1][i];
  part1 += Math.abs(a - b);
}

console.log(part1);

let part2 = 0;
for (let i = 0; i < lines[0].length; i++) {
  const a = lines[0][i];
  const count = lines[1].filter((b) => b === a).length;
  part2 += a * count;
}

console.log(part2);
