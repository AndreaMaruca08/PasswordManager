import bcrypt from "bcrypt";
import { PasswordHasher } from "../domain/PasswordHasher";

export class BCryptHasher implements PasswordHasher{
    public constructor(private readonly saltRounds: number = 10) {}

    public async hash(value: string): Promise<string> {
        return await bcrypt.hash(value, this.saltRounds);
    }

    public async compare(value: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(value, hash);
    }
}