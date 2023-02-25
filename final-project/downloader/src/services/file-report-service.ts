import "reflect-metadata";
import FileReportRepository from "../database/repositories/file-report-repository";
import HttpError from "../utils/http-error";
import FileReport from '../entities/file-report';
import logger from "jet-logger";
import FileDownloadService from './file-download-service';

export default class FileReportService {
  private fileReportRepository: FileReportRepository;
  private fileDownloadService: FileDownloadService;
  constructor() {
    this.fileReportRepository = new FileReportRepository();
  }

  async create(fileReport: FileReport) {
    try {
      let newFileReportId = await this.fileReportRepository.create(fileReport);
      return newFileReportId;
    } catch (error) {
      logger.err(error.message);
    }
  }

  async readAllFilesReport() {
    const reports = await this.fileReportRepository.readAll();
    return reports;
  }

  async readFileReport(id: string) {
    try {
      const report = await this.fileReportRepository.readOne(id);
      return report;
    } catch (error) {
      logger.err(error.message);
    }
  }

  async readByFileId(fileId: string) {
    try {
      const report = await this.fileReportRepository.readByFileId(fileId);
      return report;
    } catch (error) {
      logger.err(error.message);
    }
  }

  async update(fileReport: FileReport) {
    try {
      const exisitingFileReport = await this.readFileReport(fileReport.id);
      if (exisitingFileReport) {
        await this.fileReportRepository.update(fileReport);
      } else {
        logger.err("File report not found");
      }
    } catch (error) {
      logger.err(error.message);
    }
  }

  async deleteOne(id: string) {
    const deletedRows = await this.fileReportRepository.deleteOne(id);
    if (deletedRows !== 0) {
      logger.info(`FileReport deleted`);
    } else {
     logger.err("File not found");
    }
  }

  async receiveFromStats(fileReports: FileReport[]){
    for(const report of fileReports) {
      const foundReport = await this.readByFileId(report.fileId);
      if(foundReport) {
        foundReport.downloads = report.downloads;
        foundReport.downloadedMB = report.downloadedMB;
        foundReport.dailyDownloadedMB = report.dailyDownloadedMB;
        await this.update(foundReport);
      }
      else {
        await this.create(report);
      }
    }
  }
}
