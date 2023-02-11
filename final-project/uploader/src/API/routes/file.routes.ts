import multer from "multer";
import { Router } from "express";
import * as fileController from "../controllers/file.controller";
import { GridFsStorage }  from "multer-gridfs-storage";


const storage = new GridFsStorage({
  url: 'mongodb://0.0.0.0:27017/file-uploader',
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
router.post("/", upload.single("file"), fileController.create);
router.delete("/:fileId", fileController.deleteOne);

export default router;
