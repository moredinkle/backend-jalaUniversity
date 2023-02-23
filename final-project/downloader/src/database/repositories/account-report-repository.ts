import { AppDataSource } from "../data-source";
import AccountReportEntity from "../db-entities/account-report.entity";
import AccountReport from "../../entities/account-report";
import logger from 'jet-logger';

export default class AccountReportRepository {
  async create(accountReport: AccountReportEntity) {
    const accountReportRepository = AppDataSource.getRepository(AccountReportEntity);
    const created = await accountReportRepository.insert(accountReport);
    return created.generatedMaps[0].id;
  }

  async readAll() {
    const repository = AppDataSource.getRepository(AccountReportEntity);
    let accountReports = await repository.find();
    return accountReports ? accountReports.map((accountReport) => accountReport as AccountReport) : undefined;
  }

  async readOne(id: string):Promise<AccountReport | undefined> {
    const repository = AppDataSource.getRepository(AccountReportEntity);
    let accountReport = await repository.findOneBy({id: id});
    return accountReport ? (accountReport as AccountReport) : undefined;
  }

  async readByAccountId(accountId: string):Promise<AccountReport | undefined> {
    const repository = AppDataSource.getRepository(AccountReportEntity);
    let accountReport = await repository.findOneBy({accountId: accountId});
    return accountReport ? (accountReport as AccountReport) : undefined;
  }

  async update(accountReport: AccountReportEntity) {
    const repository = AppDataSource.getRepository(AccountReportEntity);
    const newValues = {
    //   AccountId: AccountReport.AccountId,
      downloads: accountReport.downloads,
      downloadedMB: accountReport.downloadedMB,
      dailyDownloadedMB: accountReport.dailyDownloadedMB
    };
    await repository.update(accountReport.id, newValues);
  }

  async deleteOne(id: string) {
    const repository = AppDataSource.getRepository(AccountReportEntity);
    let deleted = await repository.delete({id: id});
    return deleted.affected;
  }
}