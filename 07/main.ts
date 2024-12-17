const text = await Deno.readTextFile('./07/input.txt');
const lines = text.split('\n').map((line) => {
  const [result, calcs] = line.split(': ');
  return {
    result: result,
    calcs: calcs.split(' '),
  };
});

function generateExpressions(
  calcs: string[],
  index: number,
  current: string[][],
  operators: string[] = ['+', '*'],
): string[][] {
  if (index === calcs.length) {
    return current;
  }
  const newCurrent = operators
    .map((operator) => {
      return current.map((c) => [...c, operator, calcs[index]]);
    })
    .flat();
  return generateExpressions(calcs, index + 1, newCurrent, operators);
}

function calculate(expression: string[]): number {
  let result = parseInt(expression[0]);
  for (let i = 1; i < expression.length; i += 2) {
    if (expression[i] === '+') {
      result += parseInt(expression[i + 1]);
    } else if (expression[i] === '*') {
      result *= parseInt(expression[i + 1]);
    } else if (expression[i] === '||') {
      result = parseInt(`${result}${expression[i + 1]}`);
    } else {
      throw new Error('Unknown operator');
    }
  }
  return result;
}

const result = lines
  .filter((line) => {
    const expressions = generateExpressions(line.calcs, 1, [[line.calcs[0]]]);
    return expressions
      .map((expression) => {
        return `${calculate(expression)}`;
      })
      .includes(line.result);
  })
  .reduce((prev, curr) => {
    return prev + parseInt(curr.result);
  }, 0);

console.log(result);

// part 2

const result2 = lines
  .filter((line) => {
    const expressions = generateExpressions(
      line.calcs,
      1,
      [[line.calcs[0]]],
      ['+', '*', '||'],
    );
    return expressions
      .map((expression) => {
        return `${calculate(expression)}`;
      })
      .includes(line.result);
  })
  .reduce((prev, curr) => {
    return prev + parseInt(curr.result);
  }, 0);

console.log(result2);
