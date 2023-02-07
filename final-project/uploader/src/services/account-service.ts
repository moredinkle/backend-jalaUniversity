import "reflect-metadata";
import AccountRepository from "../database/repositories/account-repository";
import Account from "../entities/account";

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
      error.status = 500;
      error.message = "Could not create account";
      throw error;
    }
  }

  async readOne(accountId: string) {
    let account = await this.accountRepository.readOne(accountId);
    if (account) {
      return account;
    } else {
      throw new Error("Account not found");
    }
  }

  async readAll() {
    let accounts = await this.accountRepository.readAll();
    return accounts;
  }

  async update(account: Account) {
    try {
      await this.accountRepository.update(account);
    } catch (error) {
      error.message === "Account not found"
        ? (error.status = 400)
        : (error.status = 500);
      throw error;
    }
  }
  async deleteOne(id: string) {
    let deletedRows = await this.accountRepository.deleteOne(id);
    if (deletedRows !== 0) {
      console.log(`Account with id:${id} deleted`);
    } else {
      throw new Error("Account not found");
    }
  }
}
