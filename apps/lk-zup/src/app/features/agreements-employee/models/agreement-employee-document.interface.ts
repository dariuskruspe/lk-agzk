import { AgreementEmployeeDocumentPageInterface } from './agreement-employee-document-page.interface';

export interface AgreementsEmployeeDocument {
  document: AgreementEmployeeDocumentPageInterface;
  isShowMode: boolean;
}

export interface AgreementsEmployeeDocumentItem {
  id: string;
  file: string;
  name: string;
  signed: boolean;
  signedDate: string;
}
