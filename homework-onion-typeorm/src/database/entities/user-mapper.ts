import User from "../../entities/user";
import UserEntity from "./user.entity";

export class UserMapper {
  static toDomain(raw: UserEntity): User {
    const user = new User();
    user.id = raw.id
    user.name = raw.name
    user.lastname = raw.lastname
    return user;
  }

}
