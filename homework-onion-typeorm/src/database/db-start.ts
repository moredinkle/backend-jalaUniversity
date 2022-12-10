import "reflect-metadata";
import { container } from "../container";
import { USER_TYPES } from "../types";
import UserService from "../services/concrete-user-service";
import User from "../entities/user";
import { AppDataSource } from "../database/data-source";

class Test {
    async initializeDb(){
        await AppDataSource.initialize()
        // const user = new User()
        const testUser = container.get<UserService>(USER_TYPES.UserService)
        // user.name = 'ramiro'
        // user.lastname = 'casemiro'
        let us = await testUser.read(3)
        console.log(us)

        // us.lastname = 'no se'
        // await testUser.update(us)

        // user.name = 'carlos'
        // user.lastname = 'duty 3'
        // await testUser.create(user)

        // await testUser.delete(2)
    }
}

new Test().initializeDb();