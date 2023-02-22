import "reflect-metadata";
import DownloadUriRepository from "../database/repositories/download-uri-repository";
import DownloadUri from "../entities/download-uri";
import HttpError from '../utils/http-error';
import logger from 'jet-logger';
import MQService from "./rabbitmq-service";

export default class DownloadUriService {
  private downloadUriRepository: DownloadUriRepository;

  constructor() {
    this.downloadUriRepository = new DownloadUriRepository();
  }

  async create(downloadUri: DownloadUri) {
    try {
      let newDownloadUriId = await this.downloadUriRepository.create(downloadUri);
      return newDownloadUriId;
    } catch (error) {
      throw new HttpError(400, error.message);
    }
  }

  async readOne(DownloadUriId: string) {
    let downloadUri = await this.downloadUriRepository.readOne(DownloadUriId);
    if (downloadUri) {
      return downloadUri;
    } else {
      throw new HttpError(404, "DownloadUri not found");
    }
  }


  async readAll() {
    let DownloadUris = await this.downloadUriRepository.readAll();
    await this.balanceLoad();
    return DownloadUris;
  }

  async update(DownloadUri: DownloadUri) {
    try {
      const exisitingDownloadUri = await this.readOne(DownloadUri.id);
      if(exisitingDownloadUri){
        await this.downloadUriRepository.update(DownloadUri);
      }
      else {
        throw new HttpError(404, "DownloadUri not found");
      }
    } catch (error) {
      throw new HttpError(400, "Bad request");
    }
  }

  async deleteOne(id: string) {
    const deletedRows = await this.downloadUriRepository.deleteOne(id);
    if (deletedRows !== 0) {
      logger.info(`DownloadUri with id:${id} deleted`);
    } else {
      throw new HttpError(404, "File not found");
    }
  }

  async balanceLoad(): Promise<string | undefined> {
    const accountNumbers = await this.downloadUriRepository.getDownloadNumbers();
    const lastDownloads = await this.downloadUriRepository.getLastDownloads(2);

    let accountForDownload = accountNumbers[0].accountId;
    if(lastDownloads[0].accountId === lastDownloads[1].accountId) {
      accountForDownload = accountNumbers[1].accountId;
    }
    return accountForDownload;
  }

  async getAccountsUsedToday(){
    return await this.downloadUriRepository.getAccountsUsedToday();
  }

  
  async getFilesReport(){
    const files = await this.readAll();
    MQService.getInstance().publishMessage(MQService.getInstance().downloader_stats_channel, "STATS-DOWNLOADER", "stats.files.report", files);
    MQService.getInstance().publishMessage(MQService.getInstance().downloader_stats_channel, "STATS-DOWNLOADER", "stats.accounts.report", files);
  }

}
