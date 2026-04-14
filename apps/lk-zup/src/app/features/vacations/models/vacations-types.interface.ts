export interface VacationTypesInterface {
  vacationTypes: VacationTypeInterface[];
}

export interface VacationTypeInterface {
  vacationTypeId: string;
  vacationTypeID: string;
  representation: string;
  main: boolean;
  annual: boolean;
}

export interface VacationTypesResponseInterface {
  vacationTypes: VacationTypeResponseInterface[];
}

export interface VacationTypeResponseInterface {
  vacationTypeID: string;
  representation: string;
  main: boolean;
  annual: boolean;
}
