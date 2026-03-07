import express, { type Request, type Response } from "express";
import {loginHandler} from "../../index.js";
import { ok } from "../../common/HttpResponses";
import {LoginCommand} from "../application/LoginHandler";

export const authController = express.Router();

type LoginResponse = {
    token: string;
};

authController.post("/login",
    async (
        req: Request<{}, {}, LoginCommand>,
        res: Response<LoginResponse>
    ) => {
        const token = await loginHandler.handle(req.body);
        return ok(res, {token});
    }
);
