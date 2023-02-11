export type FileStatus = "REPLICATING" | "UPLOADED";
export type Queue =  "UPLOADS";
export type FileDownloadInfo = {
    viewLink: string;
    downloadLink: string;
    driveFileId: string;
    uploaderDbId: string;
}