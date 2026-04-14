import { SafeResourceUrl } from '@angular/platform-browser';

export interface FileToDownloadInterface {
  base64: string;
  uint8?: Uint8Array;
  type: string;
  name: string;
  src: SafeResourceUrl;
}
