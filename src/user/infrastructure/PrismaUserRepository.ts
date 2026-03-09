import { PrismaClient } from "../../../prisma/client";
import { UserRepository } from "../domain/UserRepository";
import { User } from "../domain/User";
import { prismaUserMap } from "./PrismaUserMapper";

export class PrismaUserRepository implements UserRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async findByUsername(username: string): Promise<User | null> {
        const prismaUser = await this.prisma.user.findUnique({ where: { username } });
        return prismaUser ? prismaUserMap(prismaUser) : null;
    }

    async exists(username: string): Promise<boolean> {
        const count = await this.prisma.user.count({ where: { username } });
        return count > 0;
    }

    async save(user: User): Promise<User> {
        const prismaUser = await this.prisma.user.upsert({
            where: { username: user.Name },
            update: {},
            create: {
                username: user.Name,
                passwordHash: user.Password,
                masterKey: user.MasterKey
            },
        });
        return prismaUserMap(prismaUser);
    }

    async update(user: User): Promise<User> {
        const prismaUser = await this.prisma.user.update({
            where: { id: user.Id },
            data: { username: user.Name },
        });
        return prismaUserMap(prismaUser);
    }

    async getById(id: number): Promise<User | null> {
        const prismaUser = await this.prisma.user.findUnique({ where: { id } });
        return prismaUser ? prismaUserMap(prismaUser) : null;
    }

    async delete(id: number): Promise<void> {
        await this.prisma.user.delete({ where: { id } });
    }
}