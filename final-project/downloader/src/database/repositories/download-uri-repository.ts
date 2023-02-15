import { AppDataSource } from "../data-source";
import DownloadUriEntity from "../db-entities/download-uri.entity";
import DownloadUri from "../../entities/download-uri";
import logger from "jet-logger";

export default class DownloadUriRepository {
  async create(downloadUri: DownloadUriEntity): Promise<string> {
    const downloadUriRepository = AppDataSource.getRepository(DownloadUriEntity);
    const created = await downloadUriRepository.insert(downloadUri);
    return created.generatedMaps[0].id;
  }

  async readAll() {
    const repository = AppDataSource.getRepository(DownloadUriEntity);
    const downloadUris = await repository.find();
    return downloadUris
      ? downloadUris.map((downloadUri) => downloadUri as DownloadUri)
      : undefined;
  }

  async readOne(id: string): Promise<DownloadUri | undefined> {
    const repository = AppDataSource.getRepository(DownloadUriEntity);
    let downloadUri = await repository.findOneBy({ id: id });
    return downloadUri ? (downloadUri as DownloadUri) : undefined;
  }

  async update(DownloadUri: DownloadUriEntity) {
    const repository = AppDataSource.getRepository(DownloadUriEntity);
    const newValues = {
      date: DownloadUri.date,
      fileId: DownloadUri.fileId,
    };
    await repository.update(DownloadUri.id, newValues);
  }

  async deleteOne(id: string) {
    const repository = AppDataSource.getRepository(DownloadUriEntity);
    let deleted = await repository.delete({ id: id });
    return deleted.affected;
  }
}