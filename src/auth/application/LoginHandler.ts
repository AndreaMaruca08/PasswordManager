import {UserRepository} from "../../user/domain/UserRepository";
import {PasswordHasher} from "../../user/domain/PasswordHasher";
import {NotFoundEx} from "../../common/exceptions/NotFoundEx";
import {UnauthorizedEx} from "../../common/exceptions/UnauthorizedEx";
import {TokenCreator} from "../../security/domain/TokenCreator";

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

export type LoginCommand = { username: string; password: string };