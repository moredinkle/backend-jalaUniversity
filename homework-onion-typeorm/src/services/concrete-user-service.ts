import User from "../entities/user"
import IUserService from "./user-services"
import { injectable, inject } from 'inversify';
import { IUserRepository } from "../repositories/user-repository";
import { USER_TYPES } from "../types";
//aqui inyecta userrepository
@injectable()
export default class UserService implements IUserService {
    private UserRepository: IUserRepository

    constructor(@inject(USER_TYPES.UserDataAccess) UserRepository: IUserRepository) {
        this.UserRepository = UserRepository
    }

    async create(user: User): Promise<void> {
        return await this.UserRepository.create(user)
    }
    async read(id: number): Promise<User> {
        return await this.UserRepository.read(id)
    }
    async update(user: User): Promise<User> {
        return await this.UserRepository.update(user)
    }
    async delete(id: number): Promise<void> {
        return await this.UserRepository.delete(id)
    }
}