import express, {type NextFunction, type Request, type Response} from "express";
import {Logger} from "./shared/Logger.js";
import {AppError} from "./shared/exceptions/AppExceptions";
import {badRequest, internal} from "./shared/HttpResponses";
import "dotenv/config";
import {PrismaClient} from "../prisma/client";
import {PrismaUserRepository} from "./user/infrastructure/PrismaUserRepository";
import {CreaUserHandler} from "./user/application/CreaUserHandler";
import {BCryptHasher} from "./user/infrastructure/BCryptHasher";
import {userController} from "./user/api/UserController";
import {PrismaPg} from "@prisma/adapter-pg";
import {Jwt} from "./security/infrastructure/Jwt";
import {LoginHandler} from "./auth/application/LoginHandler";
import {authController} from "./auth/api/AuthController";
import passport from "./security/infrastructure/Passport";
import * as v from "valibot";
import {CreatePasswordHandler} from "./password/application/CreatePasswordHandler";
import {PrismaPasswordRepository} from "./password/infrastructure/PrismaPasswordRepository";
import {Aes_256} from "./password/infrastructure/Aes_256";
import {passwordController} from "./password/api/PasswordController";
import {DeletePassworsHandler} from "./password/application/DeletePassworsHandler";
import {GetDecryptedPasswordHandler} from "./password/application/GetDecryptedPasswordHandler";
import {UpdatePasswordHandler} from "./password/application/UpdatePasswordHandler";

const app = express();
const port: number = Number(process.env.PORT);

app.use(express.json());
app.use(passport.initialize());
app.listen(port, () => {Logger.start(port)});

// Dependency injection

const adapter = new PrismaPg({connectionString: String(process.env["DATABASE_URL"])});

const prisma = new PrismaClient({adapter});
export const userRepository = new PrismaUserRepository(prisma);
export const passwordRepository = new PrismaPasswordRepository(prisma);
const passwordHasher = new BCryptHasher();
const jwt = new Jwt(process.env.JWT_SECRET!, "30m");
const eas = new Aes_256();

export const loginHandler = new LoginHandler(userRepository, passwordHasher, jwt);
export const createUserHandler = new CreaUserHandler(userRepository, passwordHasher);
export const createPasswordHandler = new CreatePasswordHandler(passwordRepository, eas);
export const deletePasswordHandler = new DeletePassworsHandler(passwordRepository);
export const getDecryptedPasswordHandler = new GetDecryptedPasswordHandler(eas, passwordRepository);
export const updatePasswordHandler = new UpdatePasswordHandler(passwordRepository, eas);

// Routes
app.use("/users", userController);
app.use("/auth", authController);
app.use("/pass", passwordController);

// Error handling globale
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
        Logger.warn(err);
        return res.status(err.statusCode).json({ error: err.message });
    }
    if (err instanceof v.ValiError) {
        Logger.warn(err + " Dettagli: " + err.issues);
        return badRequest(res, "Ricontrolla i dati inseriti");
    }
    if (err instanceof TypeError){
        Logger.warn(err + " | Errore parsing tipo");
        return badRequest(res, "Ricontrolla i dati inseriti");
    }



    Logger.err(err);
    return internal(res, "Internal Server Error");
});