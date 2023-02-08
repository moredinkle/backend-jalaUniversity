import "reflect-metadata";
import FileRepository from "../database/repositories/file-repository";
import File from "../entities/file";
import { FileStatus } from '../utils/types';
import AccountService from './account-service';
import DriveService from './drive-service';
import Account from '../entities/account';

export default class FileService {
  private FileRepository: FileRepository;
  private accountService: AccountService;

  constructor() {
    this.FileRepository = new FileRepository();
    this.accountService = new AccountService();
  }

  async create(file: File): Promise<{newFileId: string, fileStatus: FileStatus}> {
    try {
      const newFileId = await this.FileRepository.create(file);
      //TODO aqui va guardar en todas las cuentas de drive (rabbit)
      await this.setupDriveUpload(file);
      const response = {newFileId: newFileId, fileStatus: file.status}
      return response;
    } catch (error) {
      error.status = 500;
      error.message = "Could not create File";
      throw error;
    }
  }

  async readOne(FileId: string) {
    let File = await this.FileRepository.readOne(FileId);
    if (File) {
      return File;
    } else {
      throw new Error("File not found");
    }
  }

  async readAll() {
    let Files = await this.FileRepository.readAll();
    return Files;
  }

  async update(File: File) {
    try {
      await this.FileRepository.update(File);
    } catch (error) {
      error.message === "File not found"
        ? (error.status = 400)
        : (error.status = 500);
      throw error;
    }
  }

  async deleteOne(id: string) {
    let deletedRows = await this.FileRepository.deleteOne(id);
    //TODO aqui va eliminar de todas las cuentas de Drive (rabbit)
    if (deletedRows !== 0) {
      console.log(`File with id:${id} deleted`);
    } else {
      throw new Error("File not found");
    }
  }

  async setupDriveUpload(file: File){
    const accounts = await this.accountService.readAll();
    accounts.map(async (acc) => {
      await this.uploadToDrive(acc, file);
    });
    file.status = "UPLOADED";
    await this.update(file);
    //TODO eliminar de gridFs
  }
//? driveIds ????
  async uploadToDrive(account: Account, file: File){
    try {
      const driveService = new DriveService(account);
      const uploadResponse = await driveService.uploadFile(file);
      // file.driveId = uploadResponse.id;
      // await this.update(file); //*si se sube a varias cuentas no necesita driveId
    } catch (error) {
      throw error
    }
  }

  async setupDriveDelete(file: File){
    const accounts = await this.accountService.readAll();
    accounts.map(async (acc) => {
      await this.deleteFromDrive(acc, file);
    });
    file.status = "UPLOADED";
    await this.update(file);
    //TODO eliminar de gridFs
  }

  async deleteFromDrive(account: Account, file: File){
    try {
      const driveService = new DriveService(account);
      const uploadResponse = await driveService.uploadFile(file);
      // file.driveId = uploadResponse.id;
      // await this.update(file); //*si se sube a varias cuentas no necesita driveId
    } catch (error) {
      throw error
    }
  }
}
