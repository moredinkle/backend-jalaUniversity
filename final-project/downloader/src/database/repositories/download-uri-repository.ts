import { AppDataSource } from "../data-source";
import DownloadUriEntity from "../db-entities/download-uri.entity";
import DownloadUri from "../../entities/download-uri";
import logger from "jet-logger";
import { DownloadsNumbers } from "../../utils/types";

export default class DownloadUriRepository {
  async create(downloadUri: DownloadUriEntity) {
    const repository = AppDataSource.getRepository(DownloadUriEntity);
    const created = await repository.insert(downloadUri);
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

  async getDownloadNumbers() {
    const data = await AppDataSource.query(`
    SELECT "accountId", SUM(size) AS bytes_downloaded
    FROM "DownloadUri"
    WHERE DATE(date) = (now() - interval '4 hour')::date
    GROUP BY "accountIndex"
    ORDER BY bytes_downloaded ASC
    `);
    return data as DownloadsNumbers[];
  }

  async getLastDownloads(lastx: number) {
    const repository = AppDataSource.getRepository(DownloadUriEntity);
    const downloads = await repository
      .createQueryBuilder("DownloadUri")
      .orderBy("DownloadUri.date", "DESC")
      .limit(lastx)
      .getMany();
    return downloads
      ? downloads.map((downloadUri) => downloadUri as DownloadUri)
      : undefined;
  }
}
