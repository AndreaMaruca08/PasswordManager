import {BadRequestError} from "./exceptions/BadRequestError";

export function validateNull(obj: unknown, msg: string) : void{
    if(obj == null) throw new BadRequestError(msg);
}
export function validateId(obj: number, msg: string) : void{
    validateNull(obj, msg);
    if(obj < 1) throw new BadRequestError(msg)
}
export function validateString(obj: string | undefined, msg: string) : void{
    validateNull(obj, msg);
    if(!obj || obj.length == 0) throw new BadRequestError(msg)
}