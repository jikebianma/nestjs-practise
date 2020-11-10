import { EnviromentType, environment } from '@/core';
import {
    createParamDecorator,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { getManager } from 'typeorm';
import { RequestUser } from '../interface';
import { UserRepository } from '../repositories';

export const ReqUser = createParamDecorator(
    async (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const reqUser = request.user as RequestUser;
        const userRepository = getManager().getCustomRepository(UserRepository);
        if (environment() === EnviromentType.DEV) {
            return (await userRepository.find())[0];
        }
        if (!reqUser) throw new ForbiddenException();
        return await userRepository.findOneOrFail(reqUser.id);
    },
);
