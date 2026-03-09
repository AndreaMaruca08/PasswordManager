import {PasswordRepository} from "../domain/PasswordRepository";
import {Password} from "../domain/Password";
import {Encryptor} from "../domain/Encryptor";
import * as v from "valibot";

export class CreatePasswordHandler {
    constructor(
        private readonly passwordRepository: PasswordRepository,
        private readonly encryptor: Encryptor
    ) {}

    public async handle(command: CreatePasswordCommand, userId: number, masterKey: string): Promise<Password> {
        const encryptedPassword: string = this.encryptor.encrypt(command.rawPassword, masterKey);
        const password = new Password(undefined, command.title, command.website, encryptedPassword, userId, new Date());
        return await this.passwordRepository.save(password);
    }
}

export const CreatePasswordCommandSchema = v.object({
    title: v.string(),
    website: v.string(),
    rawPassword: v.string()
});

export type CreatePasswordCommand = v.InferOutput<typeof CreatePasswordCommandSchema>;