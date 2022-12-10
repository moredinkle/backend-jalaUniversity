import { AppDataSource } from './data-source';
import UserEntity from './entities/user.entity';
import { injectable } from 'inversify';
import { IUserRepository } from '../repositories/user-repository';
import { UserMapper } from './entities/user-mapper';

@injectable()
export default class userDataAccess implements IUserRepository{

    async create(user: UserEntity){
        const repository = AppDataSource.getRepository(UserEntity)
        await repository.save(user)
        console.log("user created")
    }

    async read(id: number){
        const repository = AppDataSource.getRepository(UserEntity)
        let user = await repository.findOneBy({id: id})
        return UserMapper.toDomain(user)
    }

    async update(user: UserEntity){
        const repository = AppDataSource.getRepository(UserEntity)
        return await repository.save(user)
    }

    async delete(id: number){
        const repository = AppDataSource.getRepository(UserEntity)
        await repository.delete({id: id})
        console.log(`id:${id} deleted`)
    }
}