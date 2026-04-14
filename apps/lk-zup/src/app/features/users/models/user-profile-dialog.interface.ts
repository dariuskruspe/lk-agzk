import { FpcOptionInterface } from '@wafpc/base/models/fpc.interface';

export interface UserProfileDialogInterface {
  FullName: string;
  ShortName: string;
  data: UserProfileDialogAllDataInterface;
  description: string;
  iconName: string;
  issueTypeID: string;
  options: FpcOptionInterface;
  template: [];
}

export interface UserProfileContactsDataInterface {
  contactComment: string;
  contactType: string;
  contactTypeID: string;
  contactValue: string;
}

export interface UserProfileRelativesDataInterface {
  addInfo: {
    addInfoName: string;
    addInfoValue: string;
  }[];
  dateOfBirth: string;
  fullName: string;
  relation: string;
}
export interface UserProfileEmployeesDataInterface {
  employeeID: string;
  logo: null;
  organizationID: string;
  organizationShortName: string;
}

export interface UserProfileDialogAllDataInterface {
  actualAddress: string;
  alternateManager: null;
  citizenship: string;
  contacts: UserProfileContactsDataInterface[];
  division: string;
  email: string;
  employeeID: string;
  employees: UserProfileEmployeesDataInterface[];
  employmentDate: string;
  familyStatus: null;
  forename: string;
  fullName: string;
  inn: string;
  isManager: boolean;
  manager: string;
  midname: string;
  organizationID: string;
  organizationShortName: string;
  passIssueDate: string;
  passIssued: string;
  passNumber: string;
  passSeries: string;
  passUnitCode: string;
  photo: string;
  position: string;
  registrationAddress: string;
  relatives: UserProfileRelativesDataInterface[];
  salary: number;
  snils: string;
  status: string;
  statusBegin: string;
  statusEnd: null;
  surname: string;
  userID: string;
  template?: string;
}

interface FilesInterface {
  file64: string;
  fileDescription: string;
  fileName: string;
}

// other
export interface UserProfileDialogOtherInterface {
  employeeID: string;
  familyStatus: string;
  inn: string;
  issueTypeID: string;
  relatives: { relativeItem: string }[];
  snils: string;
  userID: string;
}

// contact
export interface UserProfileDialogContactsInterface {
  contacts: { contactTypeID: string; contactValue: string }[];
  employeeID: string;
  issueTypeID: string;
  userID: string;
}

// passport
export interface UserProfileDialogPassportInterface {
  files: FilesInterface[];
  employeeID: string;
  issueTypeID: string;
  passIssued: string;
  passNumber: string;
  passSeries: string;
  passUnitCode: string;
  userID: string;
  dateEnd: null;
}

// address
export interface UserProfileDialogAddressInterface {
  issueTypeID: string;
  registrationAddress: string;
  userID: string;
  registrationDate: null;
  employeeID: string;
  files: FilesInterface[];
}

// citizenship
export interface UserProfileDialogCitizenshipInterface {
  issueTypeID: string;
  userID: string;
  employeeID: string;
  files: FilesInterface[];
  country: string;
  date: null;
}

// registrationAddress
export interface UserProfileDialogRegistrationAddressInterface {
  employeeID: string;
  files: FilesInterface[];
  issueTypeID: string;
  registrationAddress: string;
  registrationDate: null;
  userID: string;
}

// actualAddress
export interface UserProfileDialogActualAddressInterface {
  actualAddress: string;
  employeeID: string;
  issueTypeID: string;
  userID: string;
}
