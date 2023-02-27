import multer from "multer";
import { Router } from "express";
import * as fileController from "../controllers/file.controller";
import { GridFsStorage } from "multer-gridfs-storage";
import env from '../../../env/index';

const storage = new GridFsStorage({
  url: `${env.MONGO_URI}/${env.MONGO_DB}`,
  file: (req, file) => {
    return new Promise((resolve) => {
      const filename = `${new Date().getTime()}_${file.originalname}`;
      resolve(filename);
    });
  },
});


const upload = multer({ storage: storage });

const router = Router();

router.get("/", fileController.readAll);
router.get("/:fileId", fileController.readOne);
router.delete("/:fileId", fileController.deleteOne);
router.post("/", upload.single("file"), fileController.create);

export default router;
