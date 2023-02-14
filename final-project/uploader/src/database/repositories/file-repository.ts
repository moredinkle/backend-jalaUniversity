import { AppDataSource } from "../data-source";
import FileEntity from "../db-entities/file.entity";
import File from "../../entities/file";
import mongodb from "mongodb";
import { ObjectID, MongoClient, Db } from "mongodb";
import HttpError from "../../../../downloader/src/utils/http-error";

export default class FileRepository {
  private client: MongoClient;
  private db: Db;

  constructor() {
    this.connectToDb();
  }

  async connectToDb() {
    this.client = await mongodb.MongoClient.connect("mongodb://0.0.0.0:27017", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.db = this.client.db("file-uploader");
  }

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

  async getFileFromGridFS(filename: string) {
    const filesCollection = this.db.collection("fs.files");
    const chunksCollection = this.db.collection("fs.chunks");

    const file = await filesCollection.findOne({filename: filename});

    const chunks = await chunksCollection
      .find({ files_id: new ObjectID(file._id) })
      .sort({ n: 1 })
      .toArray();

    const fileBuffer = Buffer.concat(
      chunks.map((chunk: any) => Buffer.from(chunk.data.buffer))
    );
    if (fileBuffer) {
      return fileBuffer;
    } else {
      throw new HttpError(404, "File not found in GridFS");
    }
  }

  async deleteFileFromGridFS(filename: string) {
    const filesCollection = this.db.collection("fs.files");
    const chunksCollection = this.db.collection("fs.chunks");

    const file = await filesCollection.findOne({filename: filename});

    await chunksCollection.deleteMany({files_id: new ObjectID(file._id)});
    await filesCollection.deleteOne({_id: new ObjectID(file._id)});
  }
}
