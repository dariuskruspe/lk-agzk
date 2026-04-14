/********************************
 * Функции для работы с файлами *
 ********************************/

import { FileContentInterface } from '@shared/interfaces/file/file-content.interface';
import { FileDataInterface } from '@shared/interfaces/file/file-data.interface';
import { isObject } from 'lodash';
// eslint-disable-next-line import/no-extraneous-dependencies
import mime from 'mime';

/**
 * DataURL -> File
 * https://stackoverflow.com/questions/16968945/convert-base64-png-data-to-javascript-file-objects
 *
 * @param dataURL схема, которая позволяет включать небольшие элементы данных в строку URL, как если бы они были
 * ссылкой на внешний ресурс (https://ru.wikipedia.org/wiki/Data:_URL)
 * @param filename Название файла
 */
export function dataURLtoFile(dataURL: string, filename: string) {
  const arr: string[] = dataURL.split(',');
  const mime: string = arr[0].match(/:(.*?);/)[1];
  const bstr: string = atob(arr[1]);
  let n: number = bstr.length;
  const u8arr: Uint8Array = new Uint8Array(n);

  // eslint-disable-next-line no-plusplus
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

/**
 * DataURL -> Blob
 * https://stackoverflow.com/questions/6850276/how-to-convert-dataurl-to-file-object-in-javascript
 *
 * @param dataURL — схема, которая позволяет включать небольшие элементы данных в строку URL, как если бы они были
 * ссылкой на внешний ресурс (https://ru.wikipedia.org/wiki/Data:_URL)
 */
export function dataURLtoBlob(dataURL: string): Blob {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  const byteString = atob(dataURL.split(',')[1]);

  // separate out the mime component
  const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeString });
}

/**
 * Получаем расширение файла из строки с именем файла.
 *
 * @param fileName — строка с полным именем файла, включая расширение
 */
export function getFileExtensionFromFileName(fileName: string) {
  const ext: string = fileName ? fileName.split('.').pop() : null;

  return ext.length === fileName.length ? null : ext;
}

/**
 * Получаем Blob с бинарным (в двоичном виде) содержимым файла по переданным данным файла (например, по base64-строке с
 * содержимым файла и расширению файла).
 *
 * @param fileData данные файла (см. интерфейс FileDataInterface)
 */
export function getFileBlobByData(fileData: FileDataInterface): Blob {
  if (!fileData) {
    throw new Error(`No file data provided.`);
  }

  if (!isObject(fileData)) {
    throw new Error(`File data must be a valid object.`);
  }

  const fileMimeType: string =
    fileData.mimeType ?? mime.getType(fileData.extension);

  if (!fileMimeType) {
    let errorMessage: string =
      'Either MIME type or file extension must be provided.';

    if (fileData.extension) {
      errorMessage = `Failed to get MIME type by extension '${fileData.extension}'`;
    }
    throw new Error(errorMessage);
  }

  if (!fileData.content) {
    throw new Error(`No file content provided.`);
  }

  const fileContent: FileContentInterface = fileData.content;

  let byteArray: Uint8Array;

  if (fileContent.uint8Array) {
    byteArray = fileContent.uint8Array;
  } else if (fileContent.base64) {
    byteArray = new Uint8Array(
      atob(fileContent.base64)
        .split('')
        .map((char) => char.charCodeAt(0))
    );
  }

  return new Blob([byteArray], {
    type: fileMimeType,
  });
}
