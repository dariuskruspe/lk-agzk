import get from 'lodash/get';
import { JSONFilterItem } from '../types';

export function jsonFilterApply(items: any[], filters: JSONFilterItem[]) {
  return items.filter(combineFilters(filters));
}

function combineFilters(input: JSONFilterItem[]) {
  const filters = input.map((i) => buildFilter(i));

  return (item: any) => {
    for (const filter of filters) {
      if (!filter(item)) {
        return false;
      }
    }

    return true;
  };
}

function buildFilter(filter: JSONFilterItem) {
  return (item: any) => {
    const val = get(item, filter.field) ?? '';
    if (filter.operator === 'contains') {
      return val
        ?.toLowerCase()
        .includes((filter.value as string)?.toLowerCase());
    }

    return val === filter.value;
  };
}
