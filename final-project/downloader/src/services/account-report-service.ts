import AccountReportRepository from '../database/repositories/account-report-repository';
import HttpError from "../utils/http-error";
import AccountReport from "../entities/account-report";
import logger from 'jet-logger'


export default class AccountReportService {
    private accountReportRepository: AccountReportRepository;
    constructor(){
        this.accountReportRepository = new AccountReportRepository();
    }

    async readAllAccountsReport(){
        const reports = await this.accountReportRepository.readAll();
        return reports;
    }

    async readAccountReport(accountId: string){
        const report = await this.accountReportRepository.readOne(accountId);
        return report;
    }

    async create(accountReport: AccountReport) {
        try {
          let newAccountReportId = await this.accountReportRepository.create(accountReport);
          return newAccountReportId;
        } catch (error) {
          throw new HttpError(400, error.message);
        }
      }

    async update(accountReport: AccountReport) {
        try {
          const exisitingAccountReport = await this.readAccountReport(accountReport.id);
          if(exisitingAccountReport){
            await this.accountReportRepository.update(accountReport);
          }
          else {
            throw new HttpError(404, "Account report not found");
          }
        } catch (error) {
          throw new HttpError(400, error.message);
        }
      }
    
      async deleteOne(id: string) {
        const deletedRows = await this.accountReportRepository.deleteOne(id);
        if (deletedRows !== 0) {
          logger.info(`AccountReport with id:${id} deleted`);
        } else {
          throw new HttpError(404, "File not found");
        }
      }
}