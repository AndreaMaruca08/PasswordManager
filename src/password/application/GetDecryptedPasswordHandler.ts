import {Encryptor} from "../domain/Encryptor";
import {PasswordRepository} from "../domain/PasswordRepository";
import {NotFoundEx} from "../../shared/exceptions/NotFoundEx";
import {UnauthorizedEx} from "../../shared/exceptions/UnauthorizedEx";
import {User} from "../../user/domain/User";

export class GetDecryptedPasswordHandler {
    constructor(
      private readonly encryptor: Encryptor,
      private readonly passwordRepository: PasswordRepository
    ) {}

    async handle(id: number, user: User): Promise<RawPasswordResponse> {
        const password = await this.passwordRepository.getById(id);
        if(!password) throw new NotFoundEx("Password non trovata");

        if(password.UserId !== user.Id) throw new UnauthorizedEx("Non sei autorizzato a vedere questa password");
        return {
            id : Number(password.Id),
            rawPassword : this.encryptor.decrypt(password.EncryptedPassword, user.MasterKey)
        }
    }
}

export type RawPasswordResponse = {id:number, rawPassword:string}