export interface SignatureInfoContainerInterface {
  providers?: SignatureInfoInterface[] | null;
  signatureEnable?: boolean;
  fileID?: string;
  fileOwner?: string;
  file64?: string;
}

export interface SignatureInfoInterface {
  link?: string | null;
  id: string | null;
  type?: string | null;
  password?: string | null;
}
