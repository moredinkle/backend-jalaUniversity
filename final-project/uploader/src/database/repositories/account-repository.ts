import { AppDataSource } from "../data-source";
import AccountEntity from "../db-entities/account.entity";
import Account from '../../entities/account';

export default class AccountRepository {
  async create(account: AccountEntity) {
    const accountRepository = AppDataSource.getRepository(AccountEntity);
    const created = await accountRepository.insert(account);
    return created.generatedMaps[0].id;
  }

  async read(id: string) {
    const repository = AppDataSource.getRepository(AccountEntity);
    let account = await repository.findOneBy({ dbId: id });
    return account ? account as Account : undefined;
  }

  async update(account: AccountEntity) {
    const repository = AppDataSource.getRepository(AccountEntity);
    let updated = await repository.save(account);
    return updated as Account;
  }

  async delete(id: string) {
    const repository = AppDataSource.getRepository(AccountEntity);
    let deleted = await repository.delete({ dbId: id });
    return deleted.affected;
  }
}
