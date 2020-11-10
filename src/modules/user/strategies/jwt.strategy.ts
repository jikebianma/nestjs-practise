import { Configure } from '@/core';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload, RequestUser } from '../interface';
import { UserRepository } from '../repositories';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userRepository: UserRepository,
        protected configure: Configure,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configure.get('user.jwt.secret'),
        });
    }

    /**
     * 通过荷载解析出用户ID
     * 通过用户ID查询出用户是否存在,并把id放入request方便后续操作
     *
     * @param {JwtPayload} payload
     * @returns {Promise<RequestUser>}
     * @memberof JwtStrategy
     */
    async validate(payload: JwtPayload): Promise<RequestUser> {
        const user = await this.userRepository.findOneOrFail(payload.sub);
        return {
            id: user.id,
        };
    }
}
