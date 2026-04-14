export interface CreatingSmsInterface {
  action: 'signatureReleaseConfirmBySMS' | 'signingConfirmBySMS';
  objectID: string;
  code: string;
  cancelled?: boolean;
}
