import {toUnzonedDate} from "./to-unzoned-date.util";

export function getObjDifference<T>(
  source: T,
  target: T
): Partial<T> | null {
  const targetKeys = Object.keys(target);
  const result = {};

  for (let i = 0; i < targetKeys.length; i += 1) {
    const key = targetKeys[i];

    if (typeof target[key] === 'object' && !target[key]?.toISOString && source[key]) {
      return getObjDifference<T>(source[key], target[key]);
    }

    if (
      ((target[key]?.toISOString &&
      source[key]?.toISOString) ||
      (typeof target[key] == 'string' &&
        source[key]?.toISOString) ||
      (target[key]?.toISOString &&
        typeof source[key] == 'string')) &&
      new Date(source[key])?.toString()?.toLowerCase() !== 'invalid date'
    ) {
      let unzonedSource = '';
      let unzonedTarget = '';
      if (source[key]?.toISOString || new Date(source[key])?.toString()?.toLowerCase() !== 'invalid date') {
        unzonedSource = toUnzonedDate(source[key]).toISOString();
      }
      if (target[key]?.toISOString || new Date(target[key])?.toString()?.toLowerCase() !== 'invalid date') {
        unzonedTarget = toUnzonedDate(target[key]).toISOString();
      }
      if (unzonedSource !== unzonedTarget) {
        result[key] = unzonedTarget;
      }
    } else if (source[key] !== target[key]) {
      result[key] = target[key];
    }
  }

  return Object.keys(result)?.length ? result as Partial<T> : null;
}
