import { Router } from "express";
import * as accountController from '../controllers/account.controller';

const router = Router();

router.get("/", accountController.readAll);
router.get("/:accountId", accountController.readOne);
router.post("/", accountController.create);
router.put("/:accountId", accountController.update);
router.delete("/:accountId", accountController.deleteOne);


export default router;