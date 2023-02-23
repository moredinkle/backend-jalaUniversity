export default class AccountReport {
    id: string;
    accountId: string;
    downloads: number;
    downloadedMB: number;
    dailyDownloadedMB: number;
  
    constructor(
      id: string,
      accountId: string,
      downloads: number,
      downloadedMB: number,
      dailyDownloadedMB: number
    ) {
      this.id = id;
      this.accountId = accountId;
      this.downloads = downloads;
      this.downloadedMB = downloadedMB;
      this.dailyDownloadedMB = dailyDownloadedMB;
    }
  }