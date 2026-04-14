import { FileDownloadStrategyInterface } from '../../interfaces/file-download-strategy.interface';

export class FileDownloadWebStrategy implements FileDownloadStrategyInterface {
  download(url: string, fileName: string): Promise<void> {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.download = fileName;
    a.click();
    a.remove();
    return new Promise<void>(() => {});
  }
}
