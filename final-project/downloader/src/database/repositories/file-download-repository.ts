import { AppDataSource } from "../data-source";
import FileDownloadEntity from "../db-entities/file-download.entity";
import FileDownload from "../../entities/file-download";
import logger from 'jet-logger';

export default class FileDownloadRepository {
  async create(fileDownload: FileDownloadEntity) {
    const fileDownloadRepository = AppDataSource.getRepository(FileDownloadEntity);
    const created = await fileDownloadRepository.insert(fileDownload);
    return created.generatedMaps[0].id;
  }

  async readAll() {
    const repository = AppDataSource.getRepository(FileDownloadEntity);
    let fileDownloads = await repository.find();
    return fileDownloads ? fileDownloads.map((fileDownload) => fileDownload as FileDownload) : undefined;
  }

  async readOne(id: string):Promise<FileDownload | undefined> {
    const repository = AppDataSource.getRepository(FileDownloadEntity);
    let fileDownload = await repository.findOneBy({id: id});
    return fileDownload ? (fileDownload as FileDownload) : undefined;
  }

  async readByUploaderDbId(uploaderDbId: string){
    const repository = AppDataSource.getRepository(FileDownloadEntity);
    let fileDownloads = await repository.findBy({uploaderId: uploaderDbId});
    return fileDownloads ? fileDownloads.map((fileDownload) => fileDownload as FileDownload) : undefined;
  }

  async update(fileDownload: FileDownloadEntity) {
    const repository = AppDataSource.getRepository(FileDownloadEntity);
    const newValues = {
      uploaderId: fileDownload.uploaderId,
      driveId: fileDownload.driveId,
      webViewLink: fileDownload.webViewLink,
      webContentLink: fileDownload.webContentLink
    };
    await repository.update(fileDownload.id, newValues);
  }

  async deleteOne(id: string) {
    const repository = AppDataSource.getRepository(FileDownloadEntity);
    let deleted = await repository.delete({id: id});
    return deleted.affected;
  }

  async deleteByUploaderId(uploaderId: string){
    const repository = AppDataSource.getRepository(FileDownloadEntity);
    const rows = await repository.delete({uploaderId: uploaderId});
    logger.warn(`Deleted rows: ${rows}`);
    return rows.affected;
  }
}
