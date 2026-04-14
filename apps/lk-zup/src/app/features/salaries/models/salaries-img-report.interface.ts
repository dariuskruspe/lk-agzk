export interface SalariesImgReportInterface {
  employeeID: string;
  date: string;
  fileName: string;
  fileExtension: string;
  file64: string;
}

export interface SalariesImgReportInputInterface {
  currentEmployeeId: string;
  date: string;
}
