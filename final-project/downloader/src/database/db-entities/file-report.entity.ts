import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("FileReport")
export default class FileReportEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column()
  fileId: string;
  @Column()
  downloads: number;
  @Column()
  downloadedMB: number;
  @Column()
  dailyDownloadedMB: number;
}
