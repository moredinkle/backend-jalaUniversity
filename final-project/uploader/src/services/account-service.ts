import "reflect-metadata";
import AccountRepository from "../database/repositories/account-repository";
import Account from "../entities/account";
import HttpError from "../utils/http-error";

export default class AccountService {
  private accountRepository: AccountRepository;

  constructor() {
    this.accountRepository = new AccountRepository();
  }

  async create(account: Account) {
    try {
      let newAccountId = await this.accountRepository.create(account);
      account.id = newAccountId;
      return newAccountId;
    } catch (error) {
      throw new HttpError(400, "Bad request");
    }
  }

  async readOne(accountId: string) {
    let account = await this.accountRepository.readOne(accountId);
    if (account) {
      return account;
    } else {
      throw new HttpError(404, "Account not found");
    }
  }

  async readAll() {
    let accounts = await this.accountRepository.readAll();
    return accounts;
  }

  async update(account: Account) {
    try {
      const exisitingAccount = await this.readOne(account.id);
      if (exisitingAccount) {
        await this.accountRepository.update(account);
      } else {
        throw new HttpError(404, "Account not found");
      }
    } catch (error) {
      throw new HttpError(400, "Bad request");
    }
  }

  async updateRefreshToken(accountId: string, newRefreshToken) {
    try {
      const exisitingAccount = await this.readOne(accountId);
      if (exisitingAccount) {
        await this.accountRepository.updateToken(
          exisitingAccount,
          newRefreshToken
        );
      } else {
        throw new HttpError(404, "Account not found");
      }
    } catch (error) {
      throw new HttpError(400, "Bad request");
    }
  }

  async deleteOne(id: string) {
    let deletedRows = await this.accountRepository.deleteOne(id);
    if (deletedRows !== 0) {
      console.log(`Account with id:${id} deleted`);
    } else {
      throw new HttpError(404, "Account not found");
    }
  }
}
