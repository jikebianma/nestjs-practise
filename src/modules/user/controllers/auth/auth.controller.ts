import { BaseController } from '@/core';
import {
    Body,
    Controller,
    Post,
    Request,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { ReqUser } from '../../decorators';
import { AuthenticationDto } from '../../dtos';
import { User } from '../../entities';
import { JwtAuthGuard } from '../../guards';
import { AuthService } from '../../services';

@Controller('auth')
export class AuthController extends BaseController {
    constructor(private readonly authService: AuthService) {
        super();
    }

    /**
     * 用户登录
     *
     * @param {User} user
     * @param {CredentialDto} credential
     * @returns
     * @memberof AuthController
     */
    @Post('login')
    // @UseGuards(LocalAuthGuard)
    async login(
        @ReqUser() user: User,
        @Body(new ValidationPipe()) body: AuthenticationDto,
    ) {
        return { token: await this.authService.login(user) };
    }

    /**
     * 用户登出
     *
     * @param {*} req
     * @returns
     * @memberof AuthController
     */
    @Post('logout')
    @UseGuards(JwtAuthGuard)
    async logout(@Request() req: any) {
        return await this.authService.logout(req);
    }
}
