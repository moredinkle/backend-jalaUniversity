export default class FileDownload {
  id: string;
  uploaderId: string;
  driveId: string;
  webViewLink: string;
  webContentLink: string;

  constructor(
    uploaderId: string,
    driveId: string,
    webViewLink: string,
    webContentLink: string,
    id = "",
  ) {
    this.id = id;
    this.uploaderId = uploaderId;
    this.driveId = driveId;
    this.webViewLink = webViewLink;
    this.webContentLink = webContentLink;
  }
}
