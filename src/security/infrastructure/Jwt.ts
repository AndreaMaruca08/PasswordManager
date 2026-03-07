import jwt, { SignOptions, Secret } from "jsonwebtoken";
import { TokenCreator } from "../domain/TokenCreator";

export class Jwt implements TokenCreator {

    constructor(
        private readonly secret: Secret,
        private readonly expiresIn: SignOptions["expiresIn"]
    ) {}

    sign(payload: object): string {
        return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
    }

    verify(token: string): object {
        return jwt.verify(token, this.secret) as object;
    }

}