export default class FileDownload {
  id: string;
  uploaderId: string;
  driveId: string;
  webViewLink: string;
  webContentLink: string;
  size: number;
  accountIndex: number;

  constructor(
    uploaderId: string,
    driveId: string,
    webViewLink: string,
    webContentLink: string,
    size: number,
    accountIndex: number,
  ) {
    this.uploaderId = uploaderId;
    this.driveId = driveId;
    this.webViewLink = webViewLink;
    this.webContentLink = webContentLink;
    this.size = size;
    this.accountIndex = accountIndex;
  }
}
