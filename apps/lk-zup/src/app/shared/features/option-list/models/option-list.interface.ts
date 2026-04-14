export interface OptionListInterface {
  optionList: OptionListItemInterface[];
}

export interface OptionListItemInterface {
  optionID?: number;
  representation?: string;
  value: string | number;
  flag?: null;
  title?: string;
}
