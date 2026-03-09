import {CrudRepo} from "../../shared/CrudRepo";
import {Password} from "./Password";

export interface PasswordRepository extends CrudRepo<Password>{
    findByUserId(userId: number): Promise<Password[]>;
    exists(passwordId: number): Promise<boolean>;
}