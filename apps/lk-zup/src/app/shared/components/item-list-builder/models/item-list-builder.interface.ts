export interface BreakpointsInterface<T> {
  s?: T;
  m: T;
  l?: T;
}

export type ListLayoutsInterface = BreakpointsInterface<string>;

export interface ItemListBuilderInterface {
  type:
    | 'avatar'
    | 'icon'
    | 'heading'
    | 'text'
    | 'status'
    | 'spacer'
    | 'link'
    | 'checkbox'
    | 'button';
  name?: string;
  icon?: string;
  showParamName?: string;
  names?: string[];
  color?: string;
  stateEnds?: string;
  pipe?: 'date';
  prefix?: string;
  tooltip?: boolean;
  background?: string;
  textTransform?: string;
  area?: string;
  // class?: (
  //  | 'align-left'
  //  | 'align-center'
  //  | 'align-right'
  //  | 'align-sm-left'
  // | 'align-sm-center'
  //  | 'align-sm-right'
  //  | 'm-b-sm-5'
  //  | 'overflow-inherit'
  //  | 'bold'
  // )[];
  class?: string[];
}
export interface DataListItemStatus {
  fullName: string;
  id: string;
  myDept: boolean;
  photo: string;
  position: string;
  state: number;
  stateEnds: string;
  employeeName?: string;
}
