import { environment } from '@/core';
import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { TokenService } from '../services';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly tokenService: TokenService) {
        super();
    }

    getRequest(context: ExecutionContext) {
        return context.switchToHttp().getRequest();
    }

    getResponse(context: ExecutionContext) {
        return context.switchToHttp().getResponse();
    }

    /**
     * 守卫方法
     *
     * @param {ExecutionContext} context
     * @returns
     * @memberof JwtAuthGuard
     */
    async canActivate(context: ExecutionContext) {
        if (environment() === 'development') {
            return true;
        }
        const request = this.getRequest(context);
        const response = this.getResponse(context);
        // if (!request.headers.authorization) return false;
        // 从请求头中获取token
        // 如果请求头不含有authorization字段则认证失败
        const requestToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
        if (!requestToken) return false;
        // 判断token是否存在,如果不存在则认证失败
        const accessToken = await this.tokenService.checkAccessToken(
            requestToken!,
        );
        if (!accessToken) throw new UnauthorizedException();
        try {
            // 检测token是否为损坏或过期的无效状态,如果无效则尝试刷新token
            return (await super.canActivate(context)) as boolean;
        } catch (e) {
            // 尝试通过refreshToken刷新token
            // 刷新成功则给请求头更换新的token
            // 并给响应头添加新的token和refreshtoken
            const token = await this.tokenService.refreshToken(
                accessToken,
                response,
            );
            if (!token) return false;
            if (token.accessToken) {
                request.headers.authorization = `Bearer ${token.accessToken.value}`;
            }
            // 刷新失败则再次抛出认证失败的异常
            return super.canActivate(context) as boolean;
        }
    }

    /**
     * 自动请求处理
     * 如果请求中有错误则抛出错误
     * 如果请求中没有用户信息则抛出401异常
     *
     * @param {*} err
     * @param {*} user
     * @param {Error} info
     * @returns
     * @memberof JwtAuthGuard
     */
    handleRequest(err: any, user: any, info: Error) {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }
}