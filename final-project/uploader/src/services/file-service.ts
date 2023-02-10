import "reflect-metadata";
import FileRepository from "../database/repositories/file-repository";
import File from "../entities/file";
import { FileStatus } from "../utils/types";
import AccountService from "./account-service";
import DriveService from "./drive-service";
import Account from '../entities/account';
import HttpError from '../utils/http-error';
import MqService from './rabbitmq-service';

export default class FileService {
  private fileRepository: FileRepository;
  private accountService: AccountService;
  private mqService: MqService;
  
  constructor() {
    this.fileRepository = new FileRepository();
    this.accountService = new AccountService();
    this.mqService = new MqService();
  }

  async create(
    file: File
  ): Promise<{ newFileId: string; fileStatus: FileStatus }> {
    try {
      const newFileId = await this.fileRepository.create(file);
      //TODO aqui va guardar en todas las cuentas de drive (rabbit)
      //enviar el mensaje a rabiit
      this.mqService.publishMessage("UPLOADS", "START DRIVE UPLOAD");
      const response = { newFileId: newFileId, fileStatus: file.status };
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
      if(existingFile){
        await this.fileRepository.update(file);
      }
      else {
        throw new HttpError(404, "File not found");
      }
    } catch (error) {
      throw new HttpError(400, "Bad request");
    }
  }

  async deleteOne(id: string) {
    const file = await this.readOne(id);
    const deletedRows = await this.fileRepository.deleteOne(id);
    //TODO aqui va eliminar de todas las cuentas de Drive (rabbit)
    await this.setupDriveDelete(file);
    if (deletedRows !== 0) {
      console.log(`File with id:${id} deleted`);
    } else {
      throw new HttpError(404, "File not found");
    }
  }

  async setupDriveUpload(file: File) {
    const accounts = await this.accountService.readAll();
    const fileDriveIds = [];
    for (const account of accounts) {
      const newDriveId = await this.uploadToDrive(account, file);
      fileDriveIds.push(newDriveId);
    }
    file.driveIds = fileDriveIds.toString();
    file.status = "UPLOADED";
    await this.update(file);
    //mensaje a downloader 
  }
  
  async uploadToDrive(account: Account, file: File): Promise<string> {
    try {
      const driveService = new DriveService(account);
      const uploadResponse = await driveService.uploadFile(file);
      return uploadResponse.id;
    } catch (error) {
      throw error;
    }
  }

  async setupDriveDelete(file: File) {
    const driveIds = file.driveIds.split(',');
    const accounts = await this.accountService.readAll();
    driveIds.map(async (id, index) => {
      await this.deleteFromDrive(id, accounts[index]);
    });
    //TODO eliminar de gridFs
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

  async listenMessages(){
    this.mqService.consumeMessage
  }
}