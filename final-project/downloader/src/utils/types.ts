export type Exchange =  "UPLOADER-DOWNLOADER" | "STATS-DOWNLOADER";
export type DriveDeleteCompleted = {uploaderDbId: string};
export type DriveUploadCompleted = { data: FileDownloadInfo[] };
export type FileDownloadInfo = {
    viewLink: string;
    downloadLink: string;
    driveFileId: string;
    uploaderDbId: string;
    size: number;
    accountId: string;
};
export type DownloadsNumbers = {accountId: string, bytes_downloaded: number};
export type FileInfo = {
    fileId: string,
    downloads: number,
    downloadedMB: number,
    dailyDownloadedMB: number
};
export type AccountInfo = {
    accountId: string,
    downloads: number,
    downloadedMB: number,
    dailyDownloadedMB: number
};