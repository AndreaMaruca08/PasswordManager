import express, { type Request, type Response } from "express";
import {createUserHandler} from "../../index.js";
import { ok } from "../../common/HttpResponses";
import type { CreaUserCommand } from "../application/CreaUserHandler";
import passport from "../../security/infrastructure/Passport";

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
        const user = await createUserHandler.handle(req.body);
        const response: UserDTO = {
            id: user.Id,
            name: user.Name,
        };
        return ok(res, response);
    }
);

userController.get("/info",
    passport.authenticate("jwt", { session: false }),
    async (
        req: Request,
        res: Response<UserDTO>
    ) => {
        return ok(res, req.user);
    }
);