const text = await Deno.readTextFile('09/input.txt');

const file = text
  .split('')
  .map((char, idx) => {
    const num = parseInt(char, 10);
    if (idx % 2 === 0) {
      return Array.from({ length: num }, () => `${idx / 2}`);
    } else {
      return Array.from({ length: num }, () => '.');
    }
  })
  .flat();

let start = 0;
let end = file.length - 1;

while (start < end) {
  if (file[start] !== '.') {
    start++;
  } else if (file[end] === '.') {
    end--;
  } else {
    const temp = file[start];
    file[start] = file[end];
    file[end] = temp;
    start++;
    end--;
  }
}

console.log(
  file.reduce((prev, cur, idx) => {
    if (cur === '.') {
      return prev;
    }
    return prev + parseInt(cur) * idx;
  }, 0),
);
