import { config, decrypt, EnviromentType, environment, time } from '@/core';
import { Injectable } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { FastifyRequest as Request } from 'fastify';
import { ExtractJwt } from 'passport-jwt';
import { User } from '../entities';
import { UserConfig } from '../interface';
import { TokenService } from './token.service';
import { UserService } from './user.service';

/**
 * Auth服务
 *
 * @export
 * @class AuthService
 */
@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly tokenService: TokenService,
    ) {}

    /**
     * 验证用户
     *
     * @param {string} credential
     * @param {string} password
     * @returns {Promise<any>}
     * @memberof AuthService
     */
    async validateUser(credential: string, password: string): Promise<any> {
        const user = await this.userService.findOneByCredential(
            credential,
            async (query) => query.addSelect('u.password'),
        );
        if (user && decrypt(password, user.password)) {
            return user;
        }
        return false;
    }

    /**
     * 登录用户,并生成新的token和refreshToken
     *
     * @param {User} user
     * @returns
     * @memberof AuthService
     */
    async login(user: User) {
        const now = time();
        const { accessToken } = await this.tokenService.generateAccessToken(
            user,
            now,
        );
        return accessToken.value;
    }

    /**
     * 注销用户
     *
     * @param {Request} req
     * @returns
     * @memberof AuthService
     */
    async logout(req: Request) {
        const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(
            req as any,
        );
        if (accessToken) {
            await this.tokenService.removeAccessToken(accessToken);
        }

        return {
            msg: 'logout_success',
        };
    }

    /**
     * 导出Jwt模块
     *
     * @static
     * @returns
     * @userof AuthService
     */
    static jwtModuleFactory() {
        return JwtModule.registerAsync({
            useFactory: () => {
                const data = config<UserConfig['jwt']>('user.jwt');
                return {
                    secret: data.secret,
                    ignoreExpiration: environment() === EnviromentType.DEV,
                    signOptions: { expiresIn: `${data.token_expired}s` },
                };
            },
        });
    }
}
