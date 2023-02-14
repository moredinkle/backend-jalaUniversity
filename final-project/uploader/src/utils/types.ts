import File from '../entities/file';

export type FileStatus = "REPLICATING" | "UPLOADED";
export type Exchange =  "UPLOADER" | "UPLOADER-DOWNLOADER";
export type RoutingKey = "drive.upload.start" | "drive.upload.complete" | "drive.delete.start" | "drive.delete.complete";
export type DriveDeleteCompleted = {uploaderDbId: string};
export type FileToUpload = { data: File };
export type DriveUploadCompleted = { data: FileDownloadInfo[] };
export type FileDownloadInfo = {
    viewLink: string;
    downloadLink: string;
    driveFileId: string;
    uploaderDbId: string;
}