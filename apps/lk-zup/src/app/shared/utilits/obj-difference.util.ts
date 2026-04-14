import { isFiles } from './is-files.util';
import { toUnzonedDate } from './to-unzoned-date.util';

export function getObjDifference<T>(
  source: T,
  target: T,
  considerNewKeys: boolean = true
): Partial<T> | null {
  const sourceKeys = Object.keys(source);
  const targetKeys = Object.keys(target);
  const result = {};

  for (let i = 0; i < sourceKeys.length; i += 1) {
    const key = sourceKeys[i];
    if (considerNewKeys || targetKeys.includes(key)) {
      if (
        typeof target[key] === 'object' &&
        !target[key]?.toISOString &&
        !isFiles(target[key])
      ) {
        return getObjDifference<T>(source[key], target[key], considerNewKeys);
      }

      if (
        target[key]?.toISOString ||
        source[key]?.toISOString ||
        new Date(source[key])?.toString()?.toLowerCase() !== 'invalid date'
      ) {
        const unzonedSource = toUnzonedDate(source[key]).toISOString();
        const unzonedTarget = toUnzonedDate(target[key]).toISOString();
        if (unzonedSource !== unzonedTarget) {
          result[key] = unzonedTarget;
        }
      } else if (source[key] !== target[key]) {
        if (!target[key]) {
          result[key] = 'УДАЛЕНО';
        } else {
          result[key] = target[key];
        }
      }

      const index = targetKeys.findIndex((v) => v === key);
      targetKeys.splice(index, 1);
    }
  }

  for (const key of targetKeys) {
    if (considerNewKeys || isFiles(target[key])) {
      result[key] = target[key];
    }
  }

  return Object.keys(result)?.length ? result : null;
}
