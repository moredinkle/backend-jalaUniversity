import "reflect-metadata";
import FileRepository from "../database/repositories/file-repository";
import File from "../entities/file";

export default class FileService {
  private FileRepository: FileRepository;

  constructor() {
    this.FileRepository = new FileRepository();
  }

  async create(file: File) {
    try {
      let newFileId = await this.FileRepository.create(file);
      //TODO aqui va drive
      file.id = newFileId;
      return newFileId;
    } catch (error) {
      error.status = 500;
      error.message = "Could not create File";
      throw error;
    }
  }

//   async readOne(FileId: string) {
//     let File = await this.FileRepository.readOne(FileId);
//     if (File) {
//       return File;
//     } else {
//       throw new Error("File not found");
//     }
//   }

//   async readAll() {
//     let Files = await this.FileRepository.readAll();
//     return Files;
//   }

//   async update(File: File) {
//     try {
//       await this.FileRepository.update(File);
//     } catch (error) {
//       error.message === "File not found"
//         ? (error.status = 400)
//         : (error.status = 500);
//       throw error;
//     }
//   }
//   async deleteOne(id: string) {
//     let deletedRows = await this.FileRepository.deleteOne(id);
//     if (deletedRows !== 0) {
//       console.log(`File with id:${id} deleted`);
//     } else {
//       throw new Error("File not found");
//     }
//   }
}
