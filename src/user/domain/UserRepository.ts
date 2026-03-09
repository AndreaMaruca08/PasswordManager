import {User} from "./User";
import {CrudRepo} from "../../shared/CrudRepo";

export interface UserRepository extends CrudRepo<User>{
    exists(username: string): Promise<boolean>;
    findByUsername(username: string): Promise<User | null>;
}