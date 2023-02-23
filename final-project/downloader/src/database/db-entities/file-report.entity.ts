import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("FileReport")
export default class FileReportEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column()
  fileId: string;
  @Column()
  downloads: number;
  @Column({type: "decimal", precision: 6, scale: 2, default: 0})
  downloadedMB: number;
  @Column({type: "decimal", precision: 6, scale: 2, default: 0})
  dailyDownloadedMB: number;
}
