export interface MainCurrentUserInterface {
  userID: string;
  fullName: string;
  surname: string;
  forename: string;
  midname: string;
  dashboardSettings: DashboardSettings[];
  gender: 'male' | 'female';
  employees: Employees[];
  isManager: boolean;
  photo: string;

  /**
   * Base64-изображение аватарки пользователя.
   */
  image64?: string;

  /**
   * Расширение [имени] файла (filename extension) изображения аватарки пользователя (например, 'png').
   */
  imageExt?: string;
  signDate: string;
  signState: boolean;
  signExist: boolean;
  signExternal: boolean;
}

export interface Employees {
  employeeID: string;
  organizationID: string;
  organizationShortName: string;
  logo: string;
  qrlogo?: string;
  department: string;
  position: string;
  typeOfEmployment: string;
  showPayroll?: boolean;
}

export interface DashboardSettings {
  id?: string;
  name: string;
  enable: boolean;
  order: number;
  description: string;
  iconName: string;
  visible: boolean;
}
