import { Router } from "express";
import AccountController from '../controllers/account.controller';

const router = Router();
const accountController = new AccountController();

router.get("/:account-id", accountController.read);
router.post("/", accountController.create);


export default router;