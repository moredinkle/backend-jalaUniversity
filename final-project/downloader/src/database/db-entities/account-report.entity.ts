import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("AccountReport")
export default class AccountReportEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column()
  accountId: string;
  @Column()
  downloads: number;
  @Column()
  downloadedMB: number;
  @Column()
  dailyDownloadedMB: number;
}
