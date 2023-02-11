import "reflect-metadata";
import FileRepository from "../database/repositories/file-repository";
import File from "../entities/file";
import { FileStatus } from '../utils/types';
import AccountService from "./account-service";
import DriveService from "./drive-service";
import Account from "../entities/account";
import HttpError from "../utils/http-error";
import fs from "fs";
import path from "path";
import FileDownloadService from '../../../downloader/src/services/file-download-service'; //!
import { FileDownloadInfo } from '../../../downloader/src/utils/types';

export default class FileService {
  private fileRepository: FileRepository;
  private accountService: AccountService;
  // private mqService: MqService;

  constructor() {
    this.fileRepository = new FileRepository();
    this.accountService = new AccountService();
    // this.mqService = new MqService();
  }

  async create(
    file: File
  ): Promise<{ newFileId: string; fileStatus: FileStatus }> {
    try {
      const newFileId = await this.fileRepository.create(file);
      const response = { newFileId: newFileId, fileStatus: file.status };
      await this.setupDriveUpload(file);
      return response;
    } catch (error) {
      throw new HttpError(400, error.message);
    }
  }

  async readOne(FileId: string) {
    let file = await this.fileRepository.readOne(FileId);
    if (file) {
      return file;
    } else {
      throw new HttpError(404, "File not found");
    }
  }

  async readAll() {
    let files = await this.fileRepository.readAll();
    return files;
  }

  async update(file: File) {
    try {
      const existingFile = await this.readOne(file.id);
      if (existingFile) {
        await this.fileRepository.update(file);
      } else {
        throw new HttpError(404, "File not found");
      }
    } catch (error) {
      throw new HttpError(400, "Bad request");
    }
  }

  async deleteOne(id: string) {
    const file = await this.readOne(id);
    const deletedRows = await this.fileRepository.deleteOne(id);
    if (deletedRows !== 0) {
      console.log(`File with id:${id} deleted`);
      //TODO mensaje de rabbit para eliminar de drive
      await this.setupDriveDelete(file);
    } else {
      throw new HttpError(404, "File not found");
    }
  }

  async setupDriveUpload(file: File) {
    const accounts = await this.accountService.readAll();
    const fileDriveIds = [];
    const driveFilesData: FileDownloadInfo[] = [];
    for (const [index, account] of accounts.entries()) {
      const driveFileData = await this.uploadToDrive(account, file, index);
      fileDriveIds.push(driveFileData.driveFileId);
      driveFilesData.push(driveFileData);
    }

    file.driveIds = fileDriveIds.toString();
    file.status = "UPLOADED";
    await this.update(file);

    const filePath = path.join(__dirname, `../../uploads/${file.filename}`);
    fs.unlink(filePath, (err) => {
      if(err){
        throw new HttpError(500, err.message);
      }
    });

    //TODO aqui envia a downloader la data de los archivos
  }

  async uploadToDrive(account: Account, file: File, accountIndex: number): Promise<FileDownloadInfo> {
    try {
      const driveService = new DriveService(account);
      const uploadResponse = await driveService.uploadFile(file);
      const fileUrls = await driveService.generatePublicUrl(uploadResponse.id);
      const fileData = {
        viewLink: fileUrls.webViewLink,
        downloadLink: fileUrls.webContentLink,
        driveFileId: uploadResponse.id,
        uploaderDbId: file.id,
        size: file.size,
        accountIndex: accountIndex
      };
      console.log(fileData);
      return fileData;
    } catch (error) {
      throw error;
    }
  }

  async setupDriveDelete(file: File) {
    const driveIds = file.driveIds.split(",");
    const accounts = await this.accountService.readAll();
    driveIds.map(async (id, index) => {
      await this.deleteFromDrive(id, accounts[index]);
    });
  }

  async deleteFromDrive(driveId: string, account: Account) {
    try {
      let driveService = new DriveService(account);
      await driveService.deleteFile(driveId);
      driveService = undefined;
    } catch (error) {
      throw error;
    }
  }
}
