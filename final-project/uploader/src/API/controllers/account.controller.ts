import { Request, Response } from "express";
import Account from "../../entities/account";
import AccountService from "../../services/account-service";

export default class AccountController {
  private accountService: AccountService;
  constructor() {
    this.accountService = new AccountService();
  }

  async create(req: Request, res: Response) {
    try {
      const { email, client_id, client_secret, redirect_uri, refresh_token } = req.body;
      const account = new Account(
        "",
        email,
        client_id,
        client_secret,
        redirect_uri,
        refresh_token
      );
      const newAccountId = await this.accountService.create(account);
      res.status(201).json({
        message: "Account saved successfully",
        newAccountId: newAccountId,
      });
    } catch (error) {
      res.status(500);
      res.send(error.message);
    }
  }

  async read(req: Request, res: Response) {
    try {
      const { accountId } = req.body;
      const account = await this.accountService.read(accountId);
      res.status(200).json({
        message: "Account found",
        data: account,
      });
    } catch (error) {
      res.status(500);
      res.send(error.message);
    }
  }
}
