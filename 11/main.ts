const text = await Deno.readTextFile('11/input.txt');
const stones = text.split(' ').map((i) => parseInt(i, 10));

const map = new Map<string, number>();
function blink(stone: number, times: number): number {
  if (times === 0) {
    return 1;
  }
  if (map.has(`${stone}-${times}`)) {
    return map.get(`${stone}-${times}`)!;
  }
  if (stone === 0) {
    const count = blink(1, times - 1);
    map.set(`${stone}-${times}`, count);
    return count;
  }

  if (`${stone}`.length % 2 === 0) {
    const count =
      blink(parseInt(`${stone}`.slice(0, `${stone}`.length / 2)), times - 1) +
      blink(parseInt(`${stone}`.slice(`${stone}`.length / 2)), times - 1);
    map.set(`${stone}-${times}`, count);
    return count;
  }

  const count = blink(stone * 2024, times - 1);
  map.set(`${stone}-${times}`, count);
  return count;
}

console.log(
  stones
    .map((stone) => {
      return blink(stone, 25);
    })
    .reduce((prev, cur) => prev + cur, 0),
);

console.log(
  stones
    .map((stone) => {
      return blink(stone, 75);
    })
    .reduce((prev, cur) => prev + cur, 0),
);
