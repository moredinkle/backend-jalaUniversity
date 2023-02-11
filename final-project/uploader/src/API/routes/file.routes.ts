import multer from "multer";
import { Router } from "express";
import * as fileController from "../controllers/file.controller";
import { GridFsStorage } from "multer-gridfs-storage";
import HttpError from "../../utils/http-error";
const fs = require("fs");

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },

  filename: function (req: any, file: any, cb: any) {
    const date = new Date();
    cb(null, `${date.getTime()}_${file.originalname}`);
  },
});

const storage = new GridFsStorage({
  url: "mongodb://0.0.0.0:27017/file-uploader",
  file: (req, file) => {
    return new Promise((resolve) => {
      const filename = `${new Date().getTime()}_${file.originalname}`;
      resolve(filename);
    });
  },
});


const upload = multer({ storage: diskStorage });

const router = Router();

router.get("/", fileController.readAll);
router.get("/:fileId", fileController.readOne);
router.delete("/:fileId", fileController.deleteOne);
router.post("/", upload.single("file"), function (req, res, next) {
  const { file } = req;
  const stream = fs.createReadStream(file.path);
  storage
    .fromStream(stream, req, file)
    .then(() => {
      fileController.create(req, res, next);
    })
    .catch((err) => {
      throw new HttpError(500, "db upload failed");
    });
});

export default router;
