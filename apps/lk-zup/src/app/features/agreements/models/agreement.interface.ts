import { SignRoles } from '@shared/features/signature-file/models/sign-roles.enum';
import { DocumentInterface } from './document.interface';

export interface DocumentListInterface {
  documents: DocumentInterface[];
  count: number;
}

// todo deprecated
export interface AgreementInterface {
  file: string;
  id: string;
  name: string;
  signed: boolean;
  signedDate: null;
}

export interface DocumentFilterInterface {
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

export interface AgreementFileInterface {
  fileName: string;
  fileExtension: string;
  file64: string;
  fileID: string;
}

export interface DocumentTypesInterface {
  documentsTypes: {
    documentsTypeID: string;
    documentsTypeName: string;
    documentsTypeValues: string;
  }[];
}
