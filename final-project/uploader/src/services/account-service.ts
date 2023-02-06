import AccountRepository from "../database/repositories/account-repository";
import Account from "../entities/account";

export default class AccountService {
  private accountRepository: AccountRepository;

  constructor() {
    this.accountRepository = new AccountRepository();
  }

  async create(account: Account) {
    let newAccountId = await this.accountRepository.create(account);
    account.dbId = newAccountId;
    return newAccountId;
  }

  async read(accountId: string) {
    let account = await this.accountRepository.read(accountId);
    return account;
  }

  async update(account: Account){
    let updated = await this.accountRepository.update(account);
    return updated;
  }
  async delete(id: string){
    let deletedRows = await this.accountRepository.delete(id);
    if (deletedRows !== 0) {
      console.log(`Position with id:${id} deleted`);
    }
    return deletedRows;
  }
}
