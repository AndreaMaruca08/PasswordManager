import express, {type Request, type Response} from "express";
import * as v from "valibot";
import {created, ok} from "../../shared/HttpResponses";
import passport from "passport";
import {CreatePasswordCommand, CreatePasswordCommandSchema} from "../application/CreatePasswordHandler";
import {
    createPasswordHandler, deletePasswordHandler, getDecryptedPasswordHandler, passwordRepository,
    updatePasswordHandler
} from "../../index";
import {User} from "../../user/domain/User";
import {Password} from "../domain/Password";
import {RawPasswordResponse} from "../application/GetDecryptedPasswordHandler";

export const passwordController = express.Router();

type PasswordDTO = {
    id: number;
    title: string;
    website: string;
    createdAt: Date;
}

function toPasswordDTO(pass: Password):PasswordDTO{
    return {
        id: Number(pass.Id),
        title: pass.Title,
        website: pass.Website,
        createdAt: pass.CreatedAt
    }
}
function toArrPassDTO(pass: Password[]):PasswordDTO[]{return pass.map(toPasswordDTO);}

const ParamsSchema = v.object({id : v.number()})
passwordController.post("/create",
    passport.authenticate("jwt", { session: false }),
    async (
        req: Request<{}, {}, CreatePasswordCommand>,
        res: Response<PasswordDTO>
    ) => {
        const command = v.parse(CreatePasswordCommandSchema, req.body);
        const user = req.user as User;
        const password = await createPasswordHandler.handle(command, user.Id, user.MasterKey);
        return created(res, toPasswordDTO(password));
    }
);

passwordController.get("/passwords",
    passport.authenticate("jwt", { session: false }),
    async (
        req: Request,
        res: Response<PasswordDTO[]>
    ) => {
        const passwords = await passwordRepository.findByUserId((req.user as User).Id);
        return ok(res, toArrPassDTO(passwords));
    }
);

passwordController.get("/rawPassword/:id",
    passport.authenticate("jwt", { session: false }),
    async (
        req: Request<{ id: string }, {}, {}>,
        res: Response<RawPasswordResponse>
    ) => {
        const parsedParams = v.parse(ParamsSchema, { id: Number(req.params.id)});

        const rawPassword = await getDecryptedPasswordHandler.handle(parsedParams.id, (req.user as User));

        return ok(res, rawPassword);
    }
)

passwordController.delete("/delete/:id",
    passport.authenticate("jwt", { session: false }),
    async (
        req: Request<{ id: string }, {}, {}>,
        res: Response<{data: string}>
    ) => {
        const parsedParams = v.parse(ParamsSchema, { id: Number(req.params.id)});

        await deletePasswordHandler.handle(parsedParams.id, (req.user as User).Id);

        return ok(res, {data : "Password eliminata con successo"});
    }
);

passwordController.put("/update/:id",
    passport.authenticate("jwt", { session: false }),
    async (
        req: Request<{ id: string }, {}, CreatePasswordCommand>,
        res: Response<PasswordDTO>
    ) => {
        const command = v.parse(CreatePasswordCommandSchema, req.body);
        const parsedParams = v.parse(ParamsSchema, { id: Number(req.params.id)});

        const user = req.user as User;

        return ok(res, toPasswordDTO(await updatePasswordHandler.handle(parsedParams.id, command, user.Id, user.MasterKey)));
    }
);