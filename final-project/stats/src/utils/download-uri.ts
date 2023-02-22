export default class DownloadUri {
    id: string;
    date: Date;
    uri: string;
    fileId: string;
    accountId: string;
    size: number;

    constructor(fileId: string, uri: string, accountId: string, size: number){
        this.fileId = fileId;
        this.uri = uri;
        this.date = new Date();
        this.accountId = accountId;
        this.size = size;
    }
}