import {User} from "./User";

export interface UserRepository {
    getById(id: number): Promise<User | null>;
    save(user: User): Promise<User>;
    update(user: User): Promise<User>;
    delete(id: number): Promise<void>;
    exists(username: string): Promise<boolean>;

    findByUsername(username: string): Promise<User | null>;
}