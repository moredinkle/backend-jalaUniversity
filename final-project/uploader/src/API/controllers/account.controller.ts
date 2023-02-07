import { Request, Response } from "express";
import Account from "../../entities/account";
import AccountService from "../../services/account-service";

const accountService = new AccountService();

export async function create(req: Request, res: Response) {
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
    const newAccountId = await accountService.create(account);
    res.status(201).json({
      message: "Account saved successfully",
      newAccountId: newAccountId,
    });
  } catch (error) {
    res.status(error.status);
    res.send(error.message);
  }
}

export async function readOne(req: Request, res: Response) {
  try {
    const { accountId } = req.params;
    const account = await accountService.readOne(accountId);
    res.status(200).json({
      message: "Account found",
      data: account,
    });
  } catch (error) {
    error.message === "Account not found" ? error.status = 400 : error.status = 500;
    res.status(error.status);
    res.send(error.message);
  }
}

export async function readAll(req: Request, res: Response) {
  try {
    const accounts = await accountService.readAll();
    res.status(200).json({
      message: "Accounts found",
      data: accounts,
    });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export async function update(req: Request, res: Response) {
  try {
    const { accountId } = req.params;
    const { email, client_id, client_secret, redirect_uri, refresh_token } = req.body;
    const account = new Account(
      accountId,
      email,
      client_id,
      client_secret,
      redirect_uri,
      refresh_token
    );
    await accountService.update(account);
    res.status(200).json({
      message: "Account updated successfully",
    });
  } catch (error) {
    res.status(error.status);
    res.send(error.message);
  }
}

export async function deleteOne(req: Request, res: Response) {
  try {
    const { accountId } = req.params;
    await accountService.deleteOne(accountId);
    res.status(200).json({
      message: "Account deleted",
    });
  } catch (error) {
    error.message === "Account not found" ? error.status = 400 : error.status = 500;
    res.status(error.status);
    res.send(error.message);
  }
}
