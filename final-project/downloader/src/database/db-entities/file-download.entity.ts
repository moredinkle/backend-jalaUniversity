import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("FileDownload")
export default class FileDownloadEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column()
  uploaderId: string;
  @Column()
  driveId: string;
  @Column()
  webViewLink: string;
  @Column()
  webContentLink: string;
  @Column()
  size: number;
  @Column()
  accountId: string;
}
