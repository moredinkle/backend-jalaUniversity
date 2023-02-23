export type FileInfo = {
  fileId: string;
  downloads: number;
  downloadedMB: number;
  dailyDownloadedMB: number;
};
export type AccountInfo = {
  accountId: string;
  downloads: number;
  downloadedMB: number;
  dailyDownloadedMB: number;
};
export type Exchange = "STATS" | "STATS-DOWNLOADER";
