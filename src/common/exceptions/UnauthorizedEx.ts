import {AppError} from "./AppExceptions";

export class UnauthorizedEx extends AppError {
    constructor(message: string) {
        super(message, 401);
    }
}