function calculate(text: string) {
  const regex = /mul\(\d{1,3},\d{1,3}\)/g;
  const matches = text.match(regex);
  const result = matches?.reduce((acc, match) => {
    const _regex = /\d{1,3}/g;
    const [a, b] = match.match(_regex)?.map(Number) ?? [0, 0];
    return acc + a * b;
  }, 0);
  return result;
}

const text = await Deno.readTextFile('./03/input.txt');

// part1
console.log(calculate(text));

// part2
const parsedText = text
  .split('do()')
  .map((item) => {
    return item.split("don't()")[0];
  })
  .join();
console.log(calculate(parsedText));
