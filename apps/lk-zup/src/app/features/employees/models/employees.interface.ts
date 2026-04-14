export interface EmployeesInterface {
  employeeID?: string | number;
  organizationID?: string;
  userID?: string;
  fullName?: string;
  surname?: string;
  forename?: string;
  midname?: string;
  organizationShortName?: string;
  employmentDate?: string;
  salary?: string;
  email?: string;
  status?: string;
  statusBegin?: string;
  statusEnd?: string;
  division?: string;
  position?: string;
  manager?: string;
  alternateManager?: string;
  inn?: string;
  snils?: string;
  citizenship?: string;
  familyStatus?: string;
  passSeries?: string;
  passNumber?: string;
  passIssued?: string;
  passIssueDate?: string;
  passUnitCode?: string;
  registrationAddress?: string;
  actualAddress?: string;
  relatives?: EmployeeDataRelativesInterface[];
  contacts?: EmployeeDataContactsInterface[];
  applicantArchive: string;
}

export interface EmployeeDataRelativesInterface {
  files?: { fileName: string; file64: string }[];
  fullName?: string;
  dateOfBirth?: string;
  relation?: string;
  passport?: string;
  addInfo?: {
    addInfoName?: string;
    addInfoValue?: string;
  }[];
}

export interface EmployeeDataContactsInterface {
  contactType?: string;
  contactValue?: string;
}

export interface EmployeeStateListInterface {
  employeesStates: EmployeeStateListItemInterface[];
}

export interface EmployeeStateListItemInterface {
  code: number | string;
  name: string;
  icon: string;
  image: string;
}

export interface SubordinatesResponseInterface {
  employeeID: string;
  subordinates: SubordinatesEmployeeInterface[];
}

export interface SubordinatesEmployeeInterface {
  employeeID: string;
  fullName: string;
  photo: string;
  position: string;
  status: number;
  statusEnds: string | number;
}

export interface EmployeesListFormFilterValueInterface {
  search: string;
  // Рабочий статус
  state?: string | number;
  // ID организации
  organizationID?: string;
  // Подразделения
  departments?: string[];
  // Моё подразделение
  myDept: boolean;
  page: number;
  count: number;
  useSkip: boolean;
}
