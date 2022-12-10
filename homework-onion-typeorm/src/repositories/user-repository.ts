import User from "../entities/user"

export interface IUserRepository //?
{
    create(user: User): Promise<void>
    read(id: number): Promise<User>
    update(user: User): Promise<User>
    delete(id: number): Promise<void>
}

