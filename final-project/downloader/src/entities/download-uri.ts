export default class DownloadUri {
    id: string;
    date: Date;
    uri: string;
    fileId: string;

    constructor(fileId: string, uri: string){
        this.fileId = fileId;
        this.uri = uri;
        this.date = new Date();
    }
}