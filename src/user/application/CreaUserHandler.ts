import {UserRepository} from "../domain/UserRepository";
import {User} from "../domain/User";
import {PasswordHasher} from "../domain/PasswordHasher";
import {ResourceExistsError} from "../../shared/exceptions/ResourceExistsError";
import * as v from "valibot";

export class CreaUserHandler {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordHasher: PasswordHasher
    ) {}

    public async handle(command: CreaUserCommand): Promise<User> {
        if (await this.userRepository.exists(command.username)) {
            throw new ResourceExistsError("Username già esistente");
        }
        const user = new User(1, command.username, command.password);
        user.Password = await this.passwordHasher.hash(command.password);
        return await this.userRepository.save(user);
    }
}

export const CreaUserCommandSchema = v.object({
    username: v.string(),
    password: v.string()
});

export type CreaUserCommand = v.InferOutput<typeof CreaUserCommandSchema>;
