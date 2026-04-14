export interface EmployeesSubordinatesInterface {
  employeeID: string;
  subordinates?: EmployeesSubordinatesItem[];
}

export interface EmployeesSubordinatesItem {
  employeeID: string;
  fullName: string;
  position: string;
  status: number;
  statusEnds: string;
  photo: string;
}
