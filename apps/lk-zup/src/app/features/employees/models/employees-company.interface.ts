export interface EmployeesCompanyInterface {
  departments: EmployeesCompanyDepartmentsInterface[];
}

export interface EmployeesCompanyDepartmentsInterface {
  ID: string;
  name: string;
  parentID: string;
  level: number;
  organizationID: string;
}

export interface EmployeesCompaniesInterface {
  organizations: CompanyInterface[];
}

export interface CompanyInterface {
  organizationID: string;
  name: string;
  fullName: string;
  shortName: string;
  inn: string;
}
