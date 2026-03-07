import express, { type Request, type Response } from "express";
import {loginHandler} from "../../index.js";
import { ok } from "../../shared/HttpResponses";
import {LoginCommand} from "../application/LoginHandler";
import * as v from "valibot";
import {CreaUserCommandSchema} from "../../user/application/CreaUserHandler";

export const authController = express.Router();

type LoginResponse = {
    token: string;
};

authController.post("/login",
    async (
        req: Request<{}, {}, LoginCommand>,
        res: Response<LoginResponse>
    ) => {
        const command:LoginCommand = v.parse(CreaUserCommandSchema, req.body);
        const token = await loginHandler.handle(command);
        return ok(res, {token});
    }
);
