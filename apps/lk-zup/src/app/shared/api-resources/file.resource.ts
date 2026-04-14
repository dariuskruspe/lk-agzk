import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileOwners, FileType } from '@app/shared/models/files.interface';
import { createResource } from '../services/api-resource/utils';
import { TTL_1_YEAR } from '../services/api-resource/constants';
import { Environment } from '@app/shared/classes/ennvironment/environment';
import { FileBase64 } from '@app/shared/models/files.interface';

export interface FileResourceOptions {
  fileType: FileType;
  fileOwner: FileOwners;
  filePath: string;
}

export const FileBase64Resource = createResource(
  (options: FileResourceOptions) => {
    return `file-base64-${options.fileType}-${options.fileOwner}-${options.filePath}`;
  },
  (options: FileResourceOptions) => {
    const http = inject(HttpClient);
    return http.get<FileBase64>(
      `${Environment.inv().api}/wa_global/${options.fileType}/${options.fileOwner}/${options.filePath}${'/base64'}`,
      {
        responseType: 'json',
        params: {},
      },
    );
  },
  { cache: { ttl: TTL_1_YEAR } },
);
