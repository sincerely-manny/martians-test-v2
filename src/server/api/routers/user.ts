import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import signInSchema from '@/lib/schema/signIn';
import signUpSchema from '@/lib/schema/signUp';
import userPassword from '@/lib/userPassword';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { sign } from '@/lib/jwt';

const defaultUserSelect: Prisma.UserSelect = {
    id: true,
    username: true,
    email: true,
    createdAt: true,
    updatedAt: true,
    passwordHash: false,
    salt: false,
};

export default createTRPCRouter({
    signIn: publicProcedure
        .input(signInSchema)
        .mutation(async ({ input: { login, password }, ctx }) => {
            const user = await ctx.prisma.user.findFirst({
                where: {
                    OR: [
                        { email: login.toLocaleLowerCase() },
                        { username: login },
                    ],
                },
            });
            if (user && userPassword.compare(password, user.passwordHash, user.salt)) {
                const token = await sign({ id: user.id });
                const { id, username, email } = user;
                return {
                    token,
                    id,
                    email,
                    username,
                };
            }
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Invalid credentials',
            });
        }),
    checkUnique: publicProcedure
        .input(z.object({ username: z.string().optional(), email: z.string().optional() }))
        .query(async ({ input: { username, email }, ctx }) => {
            const result = {
                username: false,
                email: false,
            };
            if (username && (
                await ctx.prisma.user.findUnique({ where: { username }, select: { id: true } })
            )) {
                result.username = true;
            }
            if (email && (
                await ctx.prisma.user.findUnique(
                    { where: { email: email.toLocaleLowerCase() }, select: { id: true } },
                )
            )) {
                result.email = true;
            }
            return result;
        }),
    signUp: publicProcedure
        .input(signUpSchema)
        .mutation(async ({ input: { username, email, password }, ctx }) => {
            const { hash: passwordHash, salt } = userPassword.encode(password);
            const userExists = await ctx.prisma.user.findFirst({
                where: {
                    OR: [
                        { email: email.toLocaleLowerCase() },
                        { username },
                    ],
                },
                select: { id: true },
            });
            if (userExists) {
                throw new TRPCError({
                    code: 'CONFLICT',
                    message: `User ${email} or ${username} already exists`,
                });
            }
            const user = await ctx.prisma.user.create({
                data: {
                    username,
                    email: email.toLocaleLowerCase(),
                    passwordHash,
                    salt,
                },
                select: defaultUserSelect,
            });
            const token = await sign({ id: user.id });
            return { ...user, token };
        }),
});
