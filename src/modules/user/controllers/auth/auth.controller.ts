import { BaseController } from '@/core';
import {
    Body,
    Controller,
    Get,
    Post,
    Request,
    SerializeOptions,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { ReqUser } from '../../decorators';
import { AuthenticationDto } from '../../dtos';
import { User } from '../../entities';
import { JwtAuthGuard, LocalAuthGuard } from '../../guards';
import { AuthService, UserService } from '../../services';

@Controller('auth')
export class AuthController extends BaseController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {
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
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(
        @ReqUser() user: User,
        @Body(new ValidationPipe()) body: AuthenticationDto,
    ) {
        return { token: await this.authService.login(user) };
    }

    /**
     * 获取用户个人信息
     *
     * @param {User} user
     * @returns
     * @memberof AuthController
     */
    @Get('profile')
    @UseGuards(JwtAuthGuard)
    @SerializeOptions({
        groups: ['user-item'],
    })
    // @UseInterceptors(ClassSerializerInterceptor)
    async getProfile(@ReqUser() user: User) {
        return this.userService.findOneByIdOrFail(user.id);
    }

    /**
     * 用户登出
     *
     * @param {*} req
     * @returns
     * @memberof AuthController
     */
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Request() req: any) {
        return await this.authService.logout(req);
    }
}
