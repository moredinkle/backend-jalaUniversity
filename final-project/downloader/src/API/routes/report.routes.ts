import { Router } from "express";
import * as reportController from '../controllers/report.controller';

const router = Router();

router.get("/accounts", reportController.readAllAccountsReport);
router.get("/accounts/:accountId", reportController.readAccountReport);
router.get("/files/", reportController.readAllFilesReport);
router.get("/files/:fileId", reportController.readFileReport);

export default router;