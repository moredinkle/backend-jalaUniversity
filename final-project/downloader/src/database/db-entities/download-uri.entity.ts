import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("DownloadUri")
export default class FileDownloadEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column()
  date: Date;
  @Column()
  fileId: string;
}
