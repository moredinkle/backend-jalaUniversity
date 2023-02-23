import { AppDataSource } from "../data-source";
import FileReportEntity from "../db-entities/file-report.entity";
import FileReport from "../../entities/file-report";
import logger from 'jet-logger';

export default class FileReportRepository {
  async create(fileReport: FileReportEntity) {
    const fileReportRepository = AppDataSource.getRepository(FileReportEntity);
    const created = await fileReportRepository.insert(fileReport);
    return created.generatedMaps[0].id;
  }

  async readAll() {
    const repository = AppDataSource.getRepository(FileReportEntity);
    let fileReports = await repository.find();
    return fileReports ? fileReports.map((fileReport) => fileReport as FileReport) : undefined;
  }

  async readOne(id: string):Promise<FileReport | undefined> {
    const repository = AppDataSource.getRepository(FileReportEntity);
    let fileReport = await repository.findOneBy({id: id});
    return fileReport ? (fileReport as FileReport) : undefined;
  }

  async update(fileReport: FileReportEntity) {
    const repository = AppDataSource.getRepository(FileReportEntity);
    const newValues = {
    //   fileId: fileReport.fileId,
      downloads: fileReport.downloads,
      downloadedMB: fileReport.downloadedMB,
      dailyDownloadedMB: fileReport.dailyDownloadedMB
    };
    await repository.update(fileReport.id, newValues);
  }

  async deleteOne(id: string) {
    const repository = AppDataSource.getRepository(FileReportEntity);
    let deleted = await repository.delete({id: id});
    return deleted.affected;
  }
}
