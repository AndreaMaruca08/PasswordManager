import {AppError} from "./AppExceptions";

export class NotFoundEx extends AppError {
    constructor(message: string) {
        super(message, 404);
    }
}