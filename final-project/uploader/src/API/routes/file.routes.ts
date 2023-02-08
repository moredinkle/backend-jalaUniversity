import multer from "multer";
import { Router } from "express";
import * as fileController from '../controllers/file.controller';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },

  filename: function (req: any, file: any, cb: any) {
    const date = new Date()
    cb(null, `${date.getTime()}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

const router = Router();

router.get("/", fileController.readAll);
router.get("/:fileId", fileController.readOne);
router.post("/", upload.single('file'), fileController.create);
router.delete("/:fileId", fileController.deleteOne);

export default router;
