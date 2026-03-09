import {PasswordRepository} from "../domain/PasswordRepository";
import {passwordRepository} from "../../index";
import {NotFoundEx} from "../../shared/exceptions/NotFoundEx";
import {UnauthorizedEx} from "../../shared/exceptions/UnauthorizedEx";

export class DeletePassworsHandler {
    constructor(
        public readonly passwordRepository: PasswordRepository
    ) {}

    async handle(passwordId: number, userId: number): Promise<void> {
        const password = await passwordRepository.getById(passwordId);
        if(!password) throw new NotFoundEx("Password non trovata");

        if(password.UserId !== userId) throw new UnauthorizedEx("Non sei autorizzato a eliminare questa password");
        await this.passwordRepository.delete(passwordId);
    }
}