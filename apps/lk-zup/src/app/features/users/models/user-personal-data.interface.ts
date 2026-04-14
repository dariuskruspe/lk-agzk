export interface UserInterface {
  personalData: UserPersonalDataInterface;
}

export interface UserPersonalDataInterface {
  actualAddress: string;
  alternateManager: string;
  citizenship: string;
  contacts: UserPersonalDataContactsInterface[];
  division: string;
  email: string;
  employeeID: string;
  employmentDate: string;
  familyStatus: string;
  forename: string;
  fullName: string;
  inn: string;
  manager: string;
  midname: string;
  organizationID: string;
  organizationShortName: string;
  passIssueDate: string;
  passIssued: string;
  passNumber: string;
  passSeries: string;
  passUnitCode: string;
  position: string;
  registrationAddress: string;
  relatives: UserPersonalDataRelativesInterface[];
  salary: number;
  snils: string;
  status: string;
  statusBegin: string;
  statusEnd: string;
  surname: string;
  userID: string;
}

export interface UserPersonalDataContactsInterface {
  contactComment: string;
  contactType: string;
  contactTypeID: string;
  contactValue: string;
}

export interface UserPersonalDataRelativesInterface {
  addInfo: UserPersonalDataRelativesInfoInterface[];
  dateOfBirth: string;
  fullName: string;
  relation: string;
}
export interface UserPersonalDataRelativesInfoInterface {
  addInfoName: string;
  addInfoValue: string;
}
export interface UserDataInterface {
  employeeID?: string;
  userID?: string;
  fullName?: string;
  position?: string;
  employmentDate?: string;
  salary?: number;
  passRepresentation?: string;
  registrationAddress?: string;
  surname?: string;
  familyStatus?: string;
  country?: string;
  email?: string;
  cellPhone?: null;
  inn?: string;
  dateOfBirth?: string;
  vacationBalance?: string;
}
