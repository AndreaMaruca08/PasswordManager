import {UserRepository} from "../../user/domain/UserRepository";
import {PasswordHasher} from "../../user/domain/PasswordHasher";
import {NotFoundEx} from "../../shared/exceptions/NotFoundEx";
import {UnauthorizedEx} from "../../shared/exceptions/UnauthorizedEx";
import {TokenCreator} from "../../security/domain/TokenCreator";
import * as v from "valibot";

export class LoginHandler{
    constructor(
       private readonly userRepository: UserRepository,
       private readonly hasher: PasswordHasher,
       private readonly tokenCreator: TokenCreator
    ) {}

    async handle(command: LoginCommand): Promise<string> {
        const user = await this.userRepository.findByUsername(command.username);
        if(!user) throw new NotFoundEx("User non trovato con nome utente: " + command.username);

        const isValid = await this.hasher.compare(command.password, user.Password);
        if (!isValid) throw new UnauthorizedEx("Password errata");

        return this.tokenCreator.sign({ userId : user.Id });
    }
}

export const LoginCommandSchema = v.object({
    username: v.string(),
    password: v.string()
});

export type LoginCommand = v.InferOutput<typeof LoginCommandSchema>;