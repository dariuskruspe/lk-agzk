/**********************************
 * Функции для работы с массивами *
 **********************************/

/**
 * Перемещаем элемент в массиве с одного индекса на другой.
 *
 * https://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another
 *
 * @param arr
 * @param fromIndex
 * @param toIndex
 */
export function moveItemInArray(
  arr: any[],
  fromIndex: number,
  toIndex: number
) {
  const item = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, item);
}
