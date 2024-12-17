function findFirstSubArray(
  array: (string | number)[],
  subArray: (string | number)[],
): number {
  if (subArray.length === 0) return -1;

  return array.findIndex((_, index) => {
    // 检查从当前位置开始的子数组是否匹配
    return subArray.every(
      (item, i) =>
        array[index + i] === item && index + subArray.length <= array.length,
    );
  });
}

console.log(findFirstSubArray([1, 2, 3, 4, 5, 6], [3, 4, 5]));
