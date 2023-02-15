import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("DownloadUri")
export default class DownloadUriEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column()
  date: Date;
  @Column()
  fileId: string;
}
