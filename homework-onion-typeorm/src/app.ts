import "reflect-metadata";
import { container } from "./container";
import { USER_TYPES } from "./types";
import { IUserRepository } from './repositories/user-repository';
import User from "./entities/user";
import { AppDataSource } from "./database/data-source";

// const test = container.get<UserService>(USER_TYPES.UserService)
class Test {
    async start(){
        await AppDataSource.initialize()
        const user = new User()
        const testUser = container.get<IUserRepository>(USER_TYPES.UserService)
        // user.name = 'pele'
        // user.lastname = 'junior 20'
        // await testUser.create(user)
        // let us = await testUser.read(3)
        // us.lastname = 'o quinto raio 2'
        // testUser.update(us)

        testUser.delete(6)


    }
}

new Test().start();

