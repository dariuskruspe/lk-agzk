export interface Insurance {
  insurance: InsuranceResponse[];
}

export interface InsuranceResponse {
  insuranceData: InsuranceData;
  insuranceName: string;
  insuranceType: string;
  insuranceCalculator?: boolean;
  optionListCities: string;
  optionListGrades: string;
  optionListInsuranceDates: string;
}

export interface InsuranceData {
  description: string;
  insuredAdditionalData: InsuredAdditionalData[];
  insuredData: InsuredData[];
}
export interface InsuredAdditionalData {
  name: string;
  value: string;
}
export interface InsuredData {
  fieldsData: FieldsData[];
  header: string;
  link: string;
  insuranceProgram: string;
}
export interface FieldsData {
  name: string;
  value: string;
  link: string;
}

export interface InsuranceFile {
  file64: string;
  fileExtension: string;
  fileName: string;
}

export interface InsuranceCalculatorResponse {
  description: string;
  totalFieldName?: string;
  insurancePrograms: {
    name: string;
    description: string;
    amount: number;
    fields: { name: string; value: number | string; isTotal?: boolean }[];
  }[];
}
