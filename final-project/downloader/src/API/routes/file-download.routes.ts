import { Router } from "express";
import * as fileDownloadController from '../controllers/file-download.controller';

const router = Router();

router.get("/", fileDownloadController.readAll);
router.get("/:fileDownloadId", fileDownloadController.readOne);
router.get("/uploader/:uploaderDbId", fileDownloadController.readByUploaderDbId);
router.get("/download/:fileId", fileDownloadController.getDownloadUri);



export default router;