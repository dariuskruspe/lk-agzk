import { Injectable } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { FileDownloadWebStrategy } from '../classes/file-download/file-download-web-strategy';
import { FileDownloadStrategyInterface } from '../interfaces/file-download-strategy.interface';

@Injectable({
  providedIn: 'root',
})
export class FileDownloadService {
  download(src: string | SafeResourceUrl, fileName: string): Promise<void> {
    let strategy: FileDownloadStrategyInterface = new FileDownloadWebStrategy();

    let url = src as string;
    if (typeof src !== 'string') {
      url = (src as any).changingThisBreaksApplicationSecurity.toString();
    }

    return strategy.download(url as string, fileName);
  }
}
