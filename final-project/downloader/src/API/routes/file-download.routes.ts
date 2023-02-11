import { Router } from "express";
import * as fileDownloadController from '../controllers/file-download.controller';

const router = Router();

router.post("/", fileDownloadController.create);
router.get("/", fileDownloadController.readAll);
router.get("/:fileDownloadId", fileDownloadController.readOne);
router.get("/uploader/:uploaderDbId", fileDownloadController.readByUploaderDbId);



export default router;