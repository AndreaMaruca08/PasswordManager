import {PasswordRepository} from "../domain/PasswordRepository";
import {Encryptor} from "../domain/Encryptor";
import {NotFoundEx} from "../../shared/exceptions/NotFoundEx";
import {Password} from "../domain/Password";
import {CreatePasswordCommand} from "./CreatePasswordHandler";
import {UnauthorizedEx} from "../../shared/exceptions/UnauthorizedEx";

export class UpdatePasswordHandler {
    constructor(
        private readonly passwordRepository: PasswordRepository,
        private readonly encryptor: Encryptor
    ) {}

    async handle(id: number, command:CreatePasswordCommand, userId: number, masterKey: string): Promise<Password> {
        const password = await this.passwordRepository.getById(id);
        if(!password)
            throw new NotFoundEx("Password non trovata");
        if(password.UserId !== userId)
            throw new UnauthorizedEx("Non sei autorizzato a modificare questa password");

        const newPassword = new Password(
            password.Id,
            command.title,
            command.website,
            this.encryptor.encrypt(command.rawPassword, masterKey),
            userId,
            password.CreatedAt
        );

        return await this.passwordRepository.update(newPassword);
    }
}