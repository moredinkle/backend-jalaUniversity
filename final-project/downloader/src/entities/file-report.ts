export default class FileReport {
  id: string;
  fileId: string;
  downloads: number;
  downloadedMB: number;
  dailyDownloadedMB: number;

  constructor(
    id: string,
    fileId: string,
    downloads: number,
    downloadedMB: number,
    dailyDownloadedMB: number
  ) {
    this.id = id;
    this.fileId = fileId;
    this.downloads = downloads;
    this.downloadedMB = downloadedMB;
    this.dailyDownloadedMB = dailyDownloadedMB;
  }
}
