export interface CustomSection {
  name: string;
  id: string;
  description: string;
  nameIcon: string;
}

export interface CustomSectionContent {
  title: string;
  markup: any[];
  template: string;
  iconName: string;
}

export interface CustomSectionSaveRequest {
  title: string;
  sectionID: string;
  template: any;
  iconName: string;
}

export interface CustomSectionSaveResponse {
  success: boolean;
  errorCode?: string;
  errorMsg?: string;
  reloadTimeout?: number;
}
