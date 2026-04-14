export interface VacationsStatesInterface {
  states: VacationsStateInterface[];
}

export interface VacationsStateInterface {
  id: string;
  name: string;
  code: string;
  color: string;
  approve: boolean;
  default: boolean;
}
