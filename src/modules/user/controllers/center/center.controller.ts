import { BaseController } from '@/core';
import { Controller, Get, SerializeOptions, UseGuards } from '@nestjs/common';
import { ReqUser } from '../../decorators';
import { User } from '../../entities';
import { JwtAuthGuard } from '../../guards';
import { UserService } from '../../services';

/**
 * 用户中心
 *
 * @export
 * @class CenterController
 * @extends {BaseController}
 */
@Controller('center')
export class CenterController extends BaseController {
    constructor(private readonly userService: UserService) {
        super();
    }

    /**
     * 获取用户个人信息
     *
     * @param {User} user
     * @returns
     * @memberof AuthController
     */
    @Get('info')
    @UseGuards(JwtAuthGuard)
    @SerializeOptions({
        groups: ['user-item'],
    })
    async getProfile(@ReqUser() user: User) {
        return this.userService.findOneById(user.id);
    }
}
