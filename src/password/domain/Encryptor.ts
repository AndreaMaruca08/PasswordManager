export interface Encryptor {
    encrypt(encrypted: string, key:string): string
    decrypt(text: string, key:string): string
}