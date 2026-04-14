import { FileContentInterface } from '@shared/interfaces/file/file-content.interface';

export interface FileDataInterface {
  /**
   * Объект, хранящий содержимое файла в различном виде (см. интерфейс FileContentInterface).
   */
  content?: FileContentInterface;

  /**
   * Имя файла.
   */
  name?: string;

  /**
   * Расширение [имени] файла (filename extension).
   *
   * Например: 'pdf' или 'png'.
   */
  extension?: string;

  /**
   * MIME-тип файла (например, 'application/pdf' или 'image/png')
   */
  mimeType?: string;
}
