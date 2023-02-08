import { Column, Entity, ObjectIdColumn } from "typeorm";
import { FileStatus } from "../../utils/types";

@Entity("File")
export default class FileEntity {
    @ObjectIdColumn()
    id: string;
    @Column()
    filename: string;
    @Column()
    originalName: string;
    @Column()
    size: number;
    @Column()
    mimetype: string;
    @Column()
    status: FileStatus;
    @Column()
    driveIds?: string;
}
