export interface TokenCreator {
    sign(payload: object): string
    verify(token: string): object
}