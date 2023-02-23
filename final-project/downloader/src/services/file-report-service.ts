import FileReportRepository from "../database/repositories/file-report-repository";
import HttpError from "../utils/http-error";
import FileReport from '../entities/file-report';
import logger from "jet-logger";

export default class FileReportService {
  private fileReportRepository: FileReportRepository;
  constructor() {
    this.fileReportRepository = new FileReportRepository();
  }

  async create(fileReport: FileReport) {
    try {
      let newFileReportId = await this.fileReportRepository.create(fileReport);
      return newFileReportId;
    } catch (error) {
      throw new HttpError(400, error.message);
    }
  }

  async readAllFilesReport() {
    const reports = await this.fileReportRepository.readAll();
    return reports;
  }

  async readFileReport(fileId: string) {
    try {
      const report = await this.fileReportRepository.readOne(fileId);
      return report;
    } catch (error) {
      throw new HttpError(400, error.message);
    }
  }

  async update(fileReport: FileReport) {
    try {
      const exisitingFileReport = await this.readFileReport(fileReport.id);
      if (exisitingFileReport) {
        await this.fileReportRepository.update(fileReport);
      } else {
        throw new HttpError(404, "File report not found");
      }
    } catch (error) {
      throw new HttpError(400, error.message);
    }
  }

  async deleteOne(id: string) {
    const deletedRows = await this.fileReportRepository.deleteOne(id);
    if (deletedRows !== 0) {
      logger.info(`FileReport with id:${id} deleted`);
    } else {
      throw new HttpError(404, "File not found");
    }
  }

  async receiveFromStats(fileReports: FileReport[]){
    for(const report of fileReports) {
      const foundReport = await this.fileReportRepository.readByFileId(report.fileId);
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
