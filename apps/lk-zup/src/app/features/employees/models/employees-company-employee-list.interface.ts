export interface EmployeesCompanyEmployeeListInterface {
  employees: EmployeesCompanyEmployeeListMembersInterface[];
  count: number;
}

export interface EmployeesCompanyEmployeeListMembersInterface {
  id: string;
  fullName: string;
  position: string;
  myDept: boolean;
  photo: string;
  image64: string;
  imageExt: string;
  state: number;
  stateEnds: string;
}

export interface EmployeesCompanyEmployeeListFormFilter {
  search: string;
  state: string[];
  departments: string[];
  page: number;
  count: number;
  organizationID: string;
}
