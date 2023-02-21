import { Request, Response, NextFunction } from "express";
import Account from "../../entities/account";
import AccountService from "../../services/account-service";
import HttpError from "../../utils/http-error";

const accountService = new AccountService();

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, client_id, client_secret, redirect_uri, refresh_token } = req.body;
    if(!email || !client_id || !client_secret || !redirect_uri || !refresh_token) {
      throw new HttpError(400, "Bad request");
    }
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
    if(error instanceof HttpError) {
      next(error);
    }
    else {
      next(new HttpError(400, error.message))
    }
  }
}

export async function readOne(req: Request, res: Response, next: NextFunction) {
  try {
    const { accountId } = req.params;
    const account = await accountService.readOne(accountId);
    res.status(200).json({
      message: "Account found",
      data: account,
    });
  } catch (error) {
    if(error instanceof HttpError) {
      next(error);
    }
    else {
      next(new HttpError(400, error.message))
    }
  }
}

export async function readAll(req: Request, res: Response, next: NextFunction) {
  try {
    const accounts = await accountService.readAll();
    res.status(200).json({
      message: "Accounts found",
      data: accounts,
    });
  } catch (error) {
    if(error instanceof HttpError) {
      next(error);
    }
    else {
      next(new HttpError(400, error.message))
    }
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const { accountId } = req.params;
    const { refresh_token } = req.body;
    if(!accountId || !refresh_token) {
      throw new HttpError(400, "Bad request");
    }
    await accountService.updateRefreshToken(accountId, refresh_token);
    res.status(200).json({
      message: "Account updated successfully",
    });
  } catch (error) {
    if(error instanceof HttpError) {
      next(error);
    }
    else {
      next(new HttpError(400, error.message))
    }
  }
}

export async function deleteOne(req: Request, res: Response, next: NextFunction) {
  try {
    const { accountId } = req.params;
    await accountService.deleteOne(accountId);
    res.status(204).json({
      message: "Account deleted",
    });
  } catch (error) {
    if(error instanceof HttpError) {
      next(error);
    }
    else {
      next(new HttpError(400, error.message))
    }
  }
}
