export interface JSONFilterItem {
  field: string;
  type: JSONFilterType;
  operator: JSONFilterOperator;
  value: string | number | boolean;
}

export type JSONFilterType = 'number' | 'string' | 'boolean';
export type JSONFilterOperator = 'equals' | 'contains';
