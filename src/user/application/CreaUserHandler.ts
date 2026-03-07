import {UserRepository} from "../domain/UserRepository";
import {User} from "../domain/User";
import {PasswordHasher} from "../domain/PasswordHasher";
import {ResourceExistsError} from "../../common/exceptions/ResourceExistsError";

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

export type CreaUserCommand = {
    username: string;
    password: string;
};