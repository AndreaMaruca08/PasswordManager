import {AppError} from "./AppExceptions";

export class ResourceExistsError extends AppError {
    constructor(msg: string) {
        super(msg, 409);
    }
}