import { AppDataSource } from "../data-source";
import FileEntity from "../db-entities/file.entity";
import File from '../../entities/file';

export default class FileRepository {
  async create(file: FileEntity) {
    console.log(file);
    const fileRepository = AppDataSource.getMongoRepository(FileEntity);
    await fileRepository.save(file);
    return file.id;
  }

  async readAll() {
    const repository = AppDataSource.getMongoRepository(FileEntity);
    let files = await repository.find();
    return files ? files.map((file) =>file as File) : undefined;
  }

  async readOne(id: string) {
    const repository = AppDataSource.getMongoRepository(FileEntity);
    let file = await repository.findOneBy(id);
    return file ? file as File : undefined;
  }

  //TODO revisar que campos se podran modificar
  async update(file: FileEntity) {
    const exisitingFile = await this.readOne(file.id);
    if(exisitingFile) {
      const repository = AppDataSource.getMongoRepository(FileEntity);
      const newValues = {
        filename: file.filename,
        size: file.size,
        status: file.status,
        driveId: file.driveId,
      }
      await repository.update(file.id, newValues);
    }
    else {
      throw new Error("File not found");
    }
  }

  async deleteOne(id: string) {
    const repository = AppDataSource.getMongoRepository(FileEntity);
    let deleted = await repository.delete(id);
    return deleted.affected;
  }
}