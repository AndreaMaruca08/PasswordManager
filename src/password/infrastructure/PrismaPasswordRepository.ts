import {PasswordRepository} from "../domain/PasswordRepository";
import {Prisma, PrismaClient} from "../../../prisma/client";
import {Password} from "../domain/Password";

export class PrismaPasswordRepository implements PasswordRepository{
    constructor(private readonly prisma: PrismaClient) {}

    async delete(id: number): Promise<void> {
        await this.prisma.password.delete({where: {id}});
    }

    async exists(passwordId: number): Promise<boolean> {
        const count = await this.prisma.password.count({where: {id: passwordId}});
        return count > 0;
    }

    async findByUserId(userId: number): Promise<Password[]> {
        return mapToPasswords(await this.prisma.password.findMany({where: {userId : userId}}))
    }

    async getById(id: number): Promise<Password | null> {
        return mapToPassword(await this.prisma.password.findUnique({where: {id}}));
    }

    async save(entity: Password): Promise<Password> {
        return mapToPassword(await this.prisma.password.create({
            data: mapToDBPassword(entity),
        }));
    }

    async update(entity: Password): Promise<Password> {
        return mapToPassword(await this.prisma.password.update({
            where: {id: entity.Id},
            data: mapToDBPassword(entity),
        }));
    }

}

function mapToDBPassword(pass: Password): Prisma.PasswordCreateInput {
    return {
        title: pass.Title,
        website: pass.Website,
        encryptedPassword: pass.EncryptedPassword,
        user: { connect: { id: pass.UserId} }
    };
}

function mapToPassword(pass: any){
    return new Password(pass.id, pass.title, pass.website, pass.encryptedPassword, pass.userId, pass.createdAt);
}
function mapToPasswords(pass: any[]){
    return pass.map(mapToPassword);
}