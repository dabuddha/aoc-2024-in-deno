function getXmaxCount(line: string) {
  return (
    (line.match(/XMAS/g)?.length || 0) + (line.match(/SAMX/g)?.length || 0)
  );
}

// part 1
const text = await Deno.readTextFile('./04/input.txt');
const rows = text.split('\n');
const columns: string[] = Array.from({ length: rows[0].length });
for (let i = 0; i < rows[0].length; i++) {
  columns[i] = '';
  for (let j = 0; j < rows.length; j++) {
    columns[i] += rows[j][i];
  }
}
const tlbr: string[] = [];
const trbl: string[] = [];

for (let i = 0; i < rows.length; i++) {
  let tlbrLine = '';
  let trblLine = '';
  for (let j = 0; j < rows[0].length; j++) {
    if (i + j < rows.length) {
      tlbrLine += rows[i + j][j];
    }
    if (i + j < rows.length) {
      trblLine += rows[i + j][rows[0].length - j - 1];
    }
  }
  tlbr.push(tlbrLine);
  trbl.push(trblLine);
}

for (let i = 1; i < rows[0].length; i++) {
  let tlbrLine = '';
  let trblLine = '';
  for (let j = 0; j < rows[0].length - i; j++) {
    tlbrLine += rows[j][i + j];
    trblLine += rows[j][rows[0].length - i - j - 1];
  }
  tlbr.push(tlbrLine);
  trbl.push(trblLine);
}

const countInRow = rows.reduce((prev, row) => {
  return prev + getXmaxCount(row);
}, 0);

const countInColumn = columns.reduce((prev, column) => {
  return prev + getXmaxCount(column);
}, 0);

const countInTlbr = tlbr.reduce((prev, tlbr) => {
  return prev + getXmaxCount(tlbr);
}, 0);

const countInTrbl = trbl.reduce((prev, trbl) => {
  return prev + getXmaxCount(trbl);
}, 0);

const xmasCount = countInRow + countInColumn + countInTlbr + countInTrbl;
console.log(xmasCount);

// part 2

let xMasCount = 0;
for (let i = 0; i < rows.length; i++) {
  for (let j = 0; j < rows[0].length; j++) {
    if (rows[i][j] === 'A') {
      if (
        i - 1 >= 0 &&
        i + 1 < rows.length &&
        j - 1 >= 0 &&
        j + 1 < rows[0].length
      ) {
        const x = [
          `${rows[i - 1][j - 1]}${rows[i][j]}${rows[i + 1][j + 1]}`,
          `${rows[i - 1][j + 1]}${rows[i][j]}${rows[i + 1][j - 1]}`,
        ];
        if (
          x.every((item) => {
            if (item === 'MAS' || item === 'SAM') {
              return true;
            }
            return false;
          })
        ) {
          xMasCount++;
        }
      }
    }
  }
}

console.log(xMasCount);
