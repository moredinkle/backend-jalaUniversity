import { AppDataSource } from "../data-source";
import FileDownloadEntity from "../db-entities/file-download.entity";
import FileDownload from "../../entities/file-download";

export default class FileDownloadRepository {
  async create(fileDownload: FileDownloadEntity) {
    const fileDownloadRepository = AppDataSource.getMongoRepository(FileDownloadEntity);
    await fileDownloadRepository.save(fileDownload);
    return fileDownload.id;
  }

  async readAll() {
    const repository = AppDataSource.getMongoRepository(FileDownloadEntity);
    let fileDownloads = await repository.find();
    return fileDownloads ? fileDownloads.map((fileDownload) => fileDownload as FileDownload) : undefined;
  }

  async readOne(id: string):Promise<FileDownload | undefined> {
    const repository = AppDataSource.getMongoRepository(FileDownloadEntity);
    let fileDownload = await repository.findOneBy(id);
    return fileDownload ? (fileDownload as FileDownload) : undefined;
  }

  async readByUploaderDbId(uploaderDbId: string){
    const repository = AppDataSource.getMongoRepository(FileDownloadEntity);
    let fileDownloads = await repository.findBy({uploaderDbId: uploaderDbId});
    return fileDownloads ? fileDownloads.map((fileDownload) => fileDownload as FileDownload) : undefined;
  }

  async update(fileDownload: FileDownloadEntity) {
    const repository = AppDataSource.getMongoRepository(FileDownloadEntity);
    const newValues = {
      uploaderId: fileDownload.uploaderId,
      driveId: fileDownload.driveId,
      webViewLink: fileDownload.webViewLink,
      webContentLink: fileDownload.webContentLink
    };
    await repository.update(fileDownload.id, newValues);
  }

  async deleteOne(id: string) {
    const repository = AppDataSource.getMongoRepository(FileDownloadEntity);
    let deleted = await repository.delete(id);
    return deleted.affected;
  }
}
