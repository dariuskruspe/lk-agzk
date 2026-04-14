export type GroupedListArg<T, TGroup> = GroupedListGroup<T, TGroup>[];

export type GroupedListGroup<T, TGroup = string> = {
  group: TGroup;
  items: T[];
};
