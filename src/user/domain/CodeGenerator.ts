import * as randomPassword from "secure-random-password";
export function generateMasterKey(): string {
    return randomPassword.randomPassword({
        length: 32,
        characters: [randomPassword.lower, randomPassword.upper, randomPassword.digits]
    });
}