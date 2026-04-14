import { SignRoles } from '@shared/features/signature-file/models/sign-roles.enum';
import { AgreementEmployeeDocumentPageInterface } from './agreement-employee-document-page.interface';

export interface AgreementsEmployeeInterface {
  documents: AgreementEmployeeDocumentPageInterface[];
  count: number;
}

export interface AgreementsEmployeeItemInterface {
  file: string;
  id: string;
  name: string;
  signed: boolean;
  signedDate: null;
}

// todo deprecated
export interface AgreementEmployeeInterface {
  file: string;
  id: string;
  name: string;
  signed: boolean;
  signedDate: null;
}

export interface AgreementEmployeeFilterInterface {
  search?: string;
  signed?: boolean;
  searchTarget?: string[];
  page?: number;
  count?: number;
  mandatory?: boolean;
  state?: string | string[];
  forEmployee?: boolean | string;
  days?: string;
  useSkip?: boolean;
  documentsType?: string;
  role?: SignRoles;
}

export interface AgreementEmployeeFileInterface {
  fileName: string;
  fileExtension: string;
  file64: string;
  fileID: string;
}

export interface AgreementEmployeeDocumentTypesInterface {
  documentsTypes: {
    documentsTypeID: string;
    documentsTypeName: string;
    documentsTypeValues: string;
  }[];
}
