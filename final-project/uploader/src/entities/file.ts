import { FileStatus } from "../utils/types";

export default class File {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  mimetype: string;
  status: FileStatus;
  driveIds?: string;

  constructor(
    filename: string,
    originalName: string,
    size: number,
    mimetype: string,
    status: FileStatus,
    id = "",
    driveIds = ""
  ) {
    this.id = id;
    this.filename = filename;
    this.originalName = originalName;
    this.size = size;
    this.mimetype = mimetype;
    this.status = status;
    this.driveIds = driveIds;
  }
}
