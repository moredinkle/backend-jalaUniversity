import { Collection, Db, GridFSBucket, MongoClient } from "mongodb";
import HttpError from "../../utils/http-error";

export default class GridFsRepository {
  private client: MongoClient;
  private db: Db;
  private collection: Collection;
  private chunks: Collection;

  constructor() {
    this.startDb();
  }

  async startDb() {
    this.client = new MongoClient("mongodb://0.0.0.0:27017/");
    await this.client.connect((err) => {
      if (err) {
        throw new HttpError(500, "Mongo connection error");
      }
    });
    this.db = this.client.db("file-uploader");
    this.collection = this.db.collection("fs.files");
    this.chunks = this.db.collection("fs.chunks");
  }

  async getFile(fileName: string) {
    let r = this.collection.find({ filename: fileName }).toArray(function (err, docs) {
        if (err) {
          throw new HttpError(500, "Mongodb error");
        }
        if (!docs || docs.length === 0) {
          throw new HttpError(400, "File not found on mongodb");
        } else {
          let res = this.getFileContent(docs);
        }
      });
  }

  async getFileContent(docs: any[]) {
    //Retrieving the chunks from the db
    let res = this.chunks
      .find({ files_id: docs[0]._id })
      .sort({ n: 1 })
      .toArray(function (err, chunks) {
        if (err) {
          throw new HttpError(
            500,
            "Downlaod error. Error retrieving file content"
          );
        }
        if (!chunks || chunks.length === 0) {
          throw new HttpError(500, "File content not found");
        }

        let fileData = [];
        for (let i = 0; i < chunks.length; i++) {
          fileData.push(chunks[i].data.toString("base64"));
        }
        let finalFile = "data:" + docs[0].contentType + ";base64," + fileData.join("");
        return finalFile;
      });
    return res;
  }
}
