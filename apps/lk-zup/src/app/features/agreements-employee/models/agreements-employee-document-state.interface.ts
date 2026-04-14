export interface AgreementsEmployeeDocumentStateInterface {
  documentsStates: AgreementsEmployeeDocumentStateItemInterface[];
}

export interface AgreementsEmployeeDocumentStateItemInterface {
  id: string;
  name: string;
  color?: string;
  sign: boolean;
  buttonCaption: string;
  alias?: string;
}
