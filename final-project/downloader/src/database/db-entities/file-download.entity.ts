import { Column, Entity, ObjectIdColumn } from "typeorm";

@Entity("FileDownload")
export default class FileDownloadEntity {
  @ObjectIdColumn()
  id: string;
  @Column()
  uploaderId: string;
  @Column()
  driveId: string;
  @Column()
  webViewLink: string;
  @Column()
  webContentLink: string;
}
