export type FileContent = Blob | FileBase64 | string;

export type FileType = 'file' | 'arch' | 'documentLogs';

export type FileOwners =
  | 'general'
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
  /**
   * Имя файла.
   */
  fileName: string;

  /**
   * Расширение [имени] файла (filename extension).
   *
   * Например: 'pdf' или 'png'.
   */
  fileExtension: string;

  /**
   * Содержимое файла в кодировке Base64.
   */
  file64: string;
  fileType: string;
}
