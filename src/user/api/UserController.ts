import express, { type Request, type Response } from "express";
import {createUserHandler} from "../../index.js";
import {created, ok} from "../../shared/HttpResponses";
import {CreaUserCommand, CreaUserCommandSchema} from "../application/CreaUserHandler";
import passport from "../../security/infrastructure/Passport";
import * as v from "valibot";
import {User} from "../domain/User";

export const userController = express.Router();

type UserDTO = {
    id: number;
    name: string;
};

userController.post("/create",
    async (
        req: Request<{}, {}, CreaUserCommand>,
        res: Response<UserDTO>
    ) => {
        const command = v.parse(CreaUserCommandSchema, req.body);
        const user = await createUserHandler.handle(command);
        return created(res, toUserDTO(user));
    }
);

userController.get("/info",
    passport.authenticate("jwt", { session: false }),
    async (
        req: Request,
        res: Response<UserDTO>
    ) => {
        return ok(res, toUserDTO(req.user as User));
    }
);

function toUserDTO(user: User): UserDTO {
    return { id: user.Id, name: user.Name };
}