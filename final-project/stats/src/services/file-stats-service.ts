import DownloadUri from "../utils/download-uri";
import { FileInfo } from "../utils/types";
import logger from "jet-logger";

export default class FileStatsService {
  getAllFilesInfo(files: DownloadUri[]) {
    const filesInfo = files.map((file) => {
      return this.getFileInfo(file.fileId, files);
    });
    const report = this.filterDuplicates(filesInfo);
    logger.info(`${report.length} ${filesInfo.length}`);
    console.log(report);
    return report;
  }

  getFileInfo(fileId: string, files: DownloadUri[]) {
    try {
      let dailyDownloadedMB = 0;
      let downloadedMB = 0;
      let downloads = 0;
      for (const file of files) {
        if (file.fileId === fileId) {
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
      const fileInfo: FileInfo = {
        fileId,
        downloads,
        downloadedMB: downloadedMB / (1024 * 1024),
        dailyDownloadedMB: dailyDownloadedMB / (1024 * 1024),
      };
      return fileInfo;
    } catch (error) {
      logger.err(error.message);
    }
  }

  filterDuplicates(filesInfo: FileInfo[]) {
    const result = filesInfo.filter(
      (file, index, self) =>
        index ===
        self.findIndex(
          (it) =>
            it.fileId === file.fileId &&
            it.downloadedMB === file.downloadedMB &&
            it.dailyDownloadedMB === file.dailyDownloadedMB
        )
    );
    return result;
  }
}
