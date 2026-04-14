export interface EmployeeInterface {
  employee: EmployeePersonalDataInterface;
}

export interface EmployeePersonalDataInterface {
  contactInfo: EmployeePersonalDataContactsInterface[];
  division: string;
  employeeID: string;
  fullName: string;
  manager: string;
  managerEmployeeID: string;
  approver: string;
  approverEmployeeID: string;
  organizationID: string;
  organizationShortName: string;
  position: string;
  state: 0;
  stateEnds: string;
  userID: string;
  photo: string;
}

export interface EmployeePersonalDataContactsInterface {
  infoType: string;
  infoValue: string;
}
