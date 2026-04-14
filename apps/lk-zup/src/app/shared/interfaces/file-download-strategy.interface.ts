export interface FileDownloadStrategyInterface {
  download(url: string, fileName: string): Promise<void>;
}
