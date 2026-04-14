export interface VacationsImgReportInterface {
  employeeID: string;
  date: string;
  fileName: string;
  fileExtension: string;
  file64: string;
}

export interface VacationsImgReportInputInterface {
  currentEmployeeId: string;
  date: string;
}
