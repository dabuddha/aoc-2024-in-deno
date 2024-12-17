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

function findFirstSubArray(array: string[], subArray: string[]): number {
  if (subArray.length === 0) return -1;

  return array.findIndex((_, index) => {
    // 检查从当前位置开始的子数组是否匹配
    return subArray.every(
      (item, i) =>
        array[index + i] === item && index + subArray.length <= array.length,
    );
  });
}

// part2
let subArray: string[] = [];
let end = file.length - 1;
while (end > 0) {
  if (subArray.length === 0) {
    if (file[end] === '.') {
      end--;
    } else {
      subArray.push(file[end]);
      end--;
    }
  } else {
    if (file[end] === subArray[0]) {
      subArray.push(file[end]);
      end--;
    } else {
      const idx = findFirstSubArray(
        file.slice(0, end + 1),
        Array.from({ length: subArray.length }, () => '.'),
      );
      if (idx !== -1) {
        for (let i = idx; i < idx + subArray.length; i++) {
          file[i] = subArray[subArray.length - 1];
        }
        for (let i = end + 1; i < end + 1 + subArray.length; i++) {
          file[i] = '.';
        }
      }
      if (file[end] === '.') {
        subArray = [];
      } else {
        subArray = [file[end]];
      }
      end--;
    }
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
