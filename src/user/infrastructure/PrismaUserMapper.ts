import {User} from "../domain/User";

export function prismaUserMap(user: any): User {
    return new User(user.id, user.username, user.passwordHash, user.masterKey);
}