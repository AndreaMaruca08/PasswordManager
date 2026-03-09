import {Encryptor} from "../domain/Encryptor";
import { randomBytes, createCipheriv, createDecipheriv } from "crypto";
import { pbkdf2Sync } from "crypto";

const ALGO = "aes-256-gcm";
const IV_LENGTH = 12;
const salt = "poASDJANSDoansdoN";

export class Aes_256 implements Encryptor{
    public encrypt(text: string, key: string): string {
        const keyBuf = pbkdf2Sync(key, Buffer.from(salt), 100_000, 32, 'sha512');
        const iv = randomBytes(IV_LENGTH);
        const cipher = createCipheriv(ALGO, keyBuf, iv);

        const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
        const authTag = cipher.getAuthTag();

        return Buffer.concat([iv, authTag, encrypted]).toString("base64");
    }

    public decrypt(encryptedBase64: string, key: string): string {

        const keyBuf = pbkdf2Sync(key, Buffer.from(salt), 100_000, 32, 'sha512');

        const data = Buffer.from(encryptedBase64, "base64");

        const iv = data.subarray(0, IV_LENGTH);
        const authTag = data.subarray(IV_LENGTH, IV_LENGTH + 16);
        const encrypted = data.subarray(IV_LENGTH + 16);

        const decipher = createDecipheriv(ALGO, keyBuf, iv);
        decipher.setAuthTag(authTag);

        return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
    }
}
