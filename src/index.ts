import express, { type NextFunction, type Request, type Response } from "express";
import {Logger} from "./common/Logger.js";
import {AppError} from "./common/exceptions/AppExceptions";
import {internal} from "./common/HttpResponses";
import "dotenv/config";
import { PrismaClient } from "../prisma/client";
import {PrismaUserRepository} from "./user/infrastructure/PrismaUserRepository";
import {CreaUserHandler} from "./user/application/CreaUserHandler";
import {BCryptHasher} from "./user/infrastructure/BCryptHasher";
import {userController} from "./user/api/UserController";
import {PrismaPg} from "@prisma/adapter-pg";
import {Jwt} from "./security/infrastructure/Jwt";
import {LoginHandler} from "./auth/application/LoginHandler";
import {authController} from "./auth/api/AuthController";
import passport from "./security/infrastructure/Passport";

const app = express();
const port: number = Number(process.env.PORT);

app.use(express.json());
app.use(passport.initialize())
app.listen(port, () => {Logger.start(port)});

const adapter = new PrismaPg({connectionString: String(process.env["DATABASE_URL"])});

const prisma = new PrismaClient({adapter});
export const userRepository = new PrismaUserRepository(prisma);
const passwordHasher = new BCryptHasher();
const jwt = new Jwt(process.env.JWT_SECRET!, "15m");

export const loginHandler = new LoginHandler(userRepository, passwordHasher, jwt);
export const createUserHandler = new CreaUserHandler(userRepository, passwordHasher);

app.use("/users", userController);
app.use("/auth", authController);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
        Logger.warn(err);
        return res.status(err.statusCode).json({ error: err.message });
    }

    Logger.err(err);
    return internal(res, "Internal Server Error");
});