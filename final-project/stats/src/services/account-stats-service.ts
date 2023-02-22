import DownloadUri from "../utils/download-uri";
import { AccountInfo, FileInfo } from "../utils/types";
import logger from "jet-logger";

export default class AccountStatsService {
  getAllAccountsInfo(files: DownloadUri[]) {
    const accountsInfo = files.map((file) => {
      return this.getAccountInfo(file.accountId, files);
    });
    const report = this.filterDuplicates(accountsInfo);
    logger.info(`${report.length} ${accountsInfo.length}`);
    console.log(report);
    return report;
  }

  getAccountInfo(accountId: string, files: DownloadUri[]) {
    try {
      let dailyDownloadedMB = 0;
      let downloadedMB = 0;
      let downloads = 0;
      for (const file of files) {
        if (file.accountId === accountId) {
          downloads++;
          downloadedMB += file.size;
          const dateString = file.date as unknown as string;
          const date = dateString.slice(0, 10);
          const today = new Date().toISOString().slice(0, 10);
          if (date === today) {
            dailyDownloadedMB += file.size;
          }
        }
      }
      const fileInfo: AccountInfo = {
        accountId,
        downloads,
        downloadedMB: downloadedMB / (1024 * 1024),
        dailyDownloadedMB: dailyDownloadedMB / (1024 * 1024),
      };
      return fileInfo;
    } catch (error) {
      logger.err(error.message);
    }
  }

  filterDuplicates(filesInfo: AccountInfo[]) {
    const result = filesInfo.filter(
      (file, index, self) =>
        index ===
        self.findIndex(
          (it) =>
            it.accountId === file.accountId &&
            it.downloadedMB === file.downloadedMB &&
            it.dailyDownloadedMB === file.dailyDownloadedMB
        )
    );
    return result;
  }
}
