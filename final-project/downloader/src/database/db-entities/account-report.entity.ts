import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("AccountReport")
export default class AccountReportEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column()
  accountId: string;
  @Column()
  downloads: number;
  @Column({type: "decimal", precision: 6, scale: 2, default: 0})
  downloadedMB: number;
  @Column({type: "decimal", precision: 6, scale: 2, default: 0})
  dailyDownloadedMB: number;
}
