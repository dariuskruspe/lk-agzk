export enum Order {
  'before' = 'before',
  'after' = 'after',
  'none' = 'none',
}

export type OrderType = Order.before | Order.after | Order.none;
