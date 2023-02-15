import "reflect-metadata";
import FileDownloadRepository from "../database/repositories/file-download-repository";
import FileDownload from "../entities/file-download";
import HttpError from '../utils/http-error';
import { FileDownloadInfo } from '../utils/types';
import logger from 'jet-logger';
import DownloadUriService from './download-uri-service';
import DownloadUri from '../entities/download-uri';

export default class FileDownloadService {
  private fileDownloadRepository: FileDownloadRepository;
  private downloadUriService: DownloadUriService

  constructor() {
    this.fileDownloadRepository = new FileDownloadRepository();
    this.downloadUriService = new DownloadUriService();
  }

  async create(fileDownloadInfo: FileDownloadInfo) {
    try {
      const fileDownload = new FileDownload(
        fileDownloadInfo.uploaderDbId,
        fileDownloadInfo.driveFileId,
        fileDownloadInfo.viewLink,
        fileDownloadInfo.downloadLink,
        fileDownloadInfo.size,
        fileDownloadInfo.accountIndex
      );
      let newFileDownloadId = await this.fileDownloadRepository.create(fileDownload);
      fileDownload.id = newFileDownloadId;
      return newFileDownloadId;
    } catch (error) {
      throw new HttpError(400, error.message);
    }
  }

  async readOne(fileDownloadId: string) {
    let fileDownload = await this.fileDownloadRepository.readOne(fileDownloadId);
    if (fileDownload) {
      return fileDownload;
    } else {
      throw new HttpError(404, "FileDownload not found");
    }
  }

  async readbyUploaderDbId(uploaderDbId: string) {
    let fileDownloads = await this.fileDownloadRepository.readByUploaderDbId(uploaderDbId);
    if (fileDownloads) {
      return fileDownloads;
    } else {
      throw new HttpError(404, "Files not found");
    }
  }

  async readAll() {
    let FileDownloads = await this.fileDownloadRepository.readAll();
    return FileDownloads;
  }

  async update(fileDownload: FileDownload) {
    try {
      const exisitingFileDownload = await this.readOne(fileDownload.id);
      if(exisitingFileDownload){
        await this.fileDownloadRepository.update(fileDownload);
      }
      else {
        throw new HttpError(404, "FileDownload not found");
      }
    } catch (error) {
      throw new HttpError(400, "Bad request");
    }
  }

  async deleteOne(id: string) {
    const deletedRows = await this.fileDownloadRepository.deleteOne(id);
    if (deletedRows !== 0) {
      logger.info(`FileDownload with id:${id} deleted`);
    } else {
      throw new HttpError(404, "File not found");
    }
  }

  async deleteByUploaderId(uploaderId: string){
    const deletedRows = await this.fileDownloadRepository.deleteByUploaderId(uploaderId);
    if (deletedRows !== 0) {
    } else {
      throw new HttpError(404, "File not found");
    }
  }

  
  async getDownloadUri(uploaderId: string){
    //TODO elegir cuenta para enviar, algo como leastUsedAccount
    const files = await this.fileDownloadRepository.readByUploaderDbId(uploaderId);
    const accountIndex = Math.floor(Math.random()*3);
    logger.info(`using account: ${accountIndex} for download`);
    const downloadUri = new DownloadUri(uploaderId, files[accountIndex].webContentLink);
    const newId = await this.downloadUriService.create(downloadUri);
    downloadUri.id = newId;
    return downloadUri;
  }
}
