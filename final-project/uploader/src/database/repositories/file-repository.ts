import { AppDataSource } from "../data-source";
import FileEntity from "../db-entities/file.entity";
import File from "../../entities/file";

export default class FileRepository {
  async create(file: FileEntity) {
    const fileRepository = AppDataSource.getMongoRepository(FileEntity);
    await fileRepository.save(file);
    return file.id;
  }

  async readAll() {
    const repository = AppDataSource.getMongoRepository(FileEntity);
    let files = await repository.find();
    return files ? files.map((file) => file as File) : undefined;
  }

  async readOne(id: string): Promise<File | undefined> {
    const repository = AppDataSource.getMongoRepository(FileEntity);
    let file = await repository.findOneBy(id);
    return file ? (file as File) : undefined;
  }

  //TODO revisar que campos se podran modificar
  async update(file: FileEntity) {
    const repository = AppDataSource.getMongoRepository(FileEntity);
    const newValues = {
      filename: file.filename,
      size: file.size,
      status: file.status,
      driveIds: file.driveIds,
    };
    await repository.update(file.id, newValues);
  }

  async deleteOne(id: string) {
    const repository = AppDataSource.getMongoRepository(FileEntity);
    let deleted = await repository.delete(id);
    return deleted.affected;
  }
}