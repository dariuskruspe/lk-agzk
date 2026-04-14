export type FileType = 'file' | 'arch';

export type FileOwners =
  | 'issue'
  | 'agreement'
  | 'order'
  | 'issueFile'
  | 'issueType'
  | 'org'
  | 'user'
  | 'photo'
  | 'support';

export interface FileBase64 {
  fileName: string;
  fileExtension: string;
  file64: string;
  fileType: string;
}
