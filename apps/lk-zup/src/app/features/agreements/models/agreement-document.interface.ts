import { DocumentInterface } from './document.interface';

export interface AgreementsDocument {
  document: DocumentInterface;
  isShowMode: boolean;
}

export interface AgreementsDocumentItem {
  id: string;
  file: string;
  name: string;
  signed: boolean;
  signedDate: string;
}
