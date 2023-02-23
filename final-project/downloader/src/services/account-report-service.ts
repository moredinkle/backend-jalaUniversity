import "reflect-metadata";
import AccountReportRepository from "../database/repositories/account-report-repository";
import HttpError from "../utils/http-error";
import AccountReport from "../entities/account-report";
import logger from "jet-logger";

export default class AccountReportService {
  private accountReportRepository: AccountReportRepository;
  constructor() {
    this.accountReportRepository = new AccountReportRepository();
  }

  async readAllAccountsReport() {
    const reports = await this.accountReportRepository.readAll();
    return reports;
  }

  async readAccountReport(id: string) {
    const report = await this.accountReportRepository.readOne(id);
    return report;
  }

  async readByAccountId(accountId: string) {
    const report = await this.accountReportRepository.readByAccountId(accountId);
    return report;
  }

  async create(accountReport: AccountReport) {
    try {
      let newAccountReportId = await this.accountReportRepository.create(
        accountReport
      );
      return newAccountReportId;
    } catch (error) {
      logger.err(error.message);
    }
  }

  async update(accountReport: AccountReport) {
    try {
      const exisitingAccountReport = await this.readAccountReport(accountReport.id);
      if (exisitingAccountReport) {
        await this.accountReportRepository.update(accountReport);
      } else {
        logger.err( "Account report not found");
      }
    } catch (error) {
      logger.err(error.message);
    }
  }

  async deleteOne(id: string) {
    const deletedRows = await this.accountReportRepository.deleteOne(id);
    if (deletedRows !== 0) {
      logger.info(`AccountReport with id:${id} deleted`);
    } else {
      logger.err("File not found");
    }
  }

  async receiveFromStats(fileReports: AccountReport[]){
    for(const report of fileReports) {
      const foundReport = await this.readByAccountId(report.accountId);
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
