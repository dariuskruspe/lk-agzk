export interface VacationInterface {
  vacationBalance: number;
  vacationID: string;
  vacationName: string;
}
export interface EmployeeInterface {
  employeeID: string;
  fullName: string;
  position: string;
  photo: string;
  vacation: {
    vacationBegin: string;
    vacationDays: number;
    vacationEnd: string;
    vacationRescheduled: boolean;
    vacationTypeID: string;
  };
  vacationsBalance: VacationInterface[];
  vacationsTotal: number;
}
export interface EmployeeListItemInterface {
  id: string;
  fullName: string;
}

export interface VacationEmployeeDownloadInterface {
  date: string;
  employeeID: string;
  file64: string;
  fileExtension: string;
  fileName: string;
}
