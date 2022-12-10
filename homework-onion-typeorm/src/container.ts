import { Container } from "inversify";
import { IUserRepository } from "./repositories/user-repository";
import { USER_TYPES } from "./types";
import userDataAccess from "./database/data-access";
import UserService from "./services/concrete-user-service";

const container = new Container();
container.bind<IUserRepository>(USER_TYPES.UserDataAccess).to(userDataAccess);
container.bind<IUserRepository>(USER_TYPES.UserService).to(UserService);


export { container }