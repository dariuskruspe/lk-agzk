export interface IssuesAddInterface {
  cellPhone: {
    name: string;
    value: null;
  };
  country: IssuesAddStaticDataInterface;
  additionalVacationBalance: IssuesAddStaticDataInterface;
  dayOffBalance: IssuesAddStaticDataInterface;
  dateOfBirth: IssuesAddStaticDataInterface;
  email: IssuesAddStaticDataInterface;
  employeeID: IssuesAddStaticDataInterface;
  employmentDate: IssuesAddStaticDataInterface;
  familyStatus: IssuesAddStaticDataInterface;
  fullName: IssuesAddStaticDataInterface;
  inn: IssuesAddStaticDataInterface;
  passRepresentation: IssuesAddStaticDataInterface;
  position: IssuesAddStaticDataInterface;
  registrationAddress: IssuesAddStaticDataInterface;
  salary: IssuesAddStaticDataNumberInterface;
  surname: IssuesAddStaticDataInterface;
  userID: IssuesAddStaticDataInterface;
  vacationBalance: IssuesAddStaticDataInterface;
}
export interface IssuesAddStaticDataInterface {
  name: string;
  value: string;
}

export interface IssuesAddStaticDataNumberInterface {
  name: string;
  value: number;
}
