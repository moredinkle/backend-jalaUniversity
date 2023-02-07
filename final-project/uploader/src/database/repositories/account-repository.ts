import { AppDataSource } from "../data-source";
import AccountEntity from "../db-entities/account.entity";
import Account from '../../entities/account';

export default class AccountRepository {
  async create(account: AccountEntity) {
    const accountRepository = AppDataSource.getMongoRepository(AccountEntity);
    await accountRepository.save(account);
    return account.id;
  }

  async readAll() {
    const repository = AppDataSource.getMongoRepository(AccountEntity);
    let accounts = await repository.find();
    return accounts ? accounts.map((account) => account as Account) : undefined;
  }

  async readOne(id: string) {
    const repository = AppDataSource.getMongoRepository(AccountEntity);
    let account = await repository.findOneBy(id);
    return account ? account as Account : undefined;
  }

  //TODO revisar que campos se podran modificar
  async update(account: AccountEntity) {
    const exisitingAccount = await this.readOne(account.id);
    if(exisitingAccount) {
      const repository = AppDataSource.getMongoRepository(AccountEntity);
      const newValues = {
        email: account.email,
        client_id: account.client_id,
        client_secret: account.client_secret,
        redirect_uri: account.redirect_uri,
        refresh_token: account.refresh_token
      }
      await repository.update(account.id, newValues);
    }
    else {
      throw new Error("Account not found");
    }
  }

  async deleteOne(id: string) {
    const repository = AppDataSource.getMongoRepository(AccountEntity);
    let deleted = await repository.delete(id);
    return deleted.affected;
  }
}
