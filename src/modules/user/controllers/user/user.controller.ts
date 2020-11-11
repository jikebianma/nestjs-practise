import { BaseController, ParseUUIDEntityPipe } from '@/core';
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Query,
    SerializeOptions,
    UseGuards,
} from '@nestjs/common';
import { classToPlain } from 'class-transformer';
import { QueryUserDto, UpdateUserDto } from '../../dtos';
import { User } from '../../entities';
import { JwtAuthGuard } from '../../guards';
import { UserService } from '../../services';

/**
 * 用户管理
 *
 * @export
 * @class UserController
 * @extends {BaseController}
 */
@Controller('manage')
export class UserController extends BaseController {
    constructor(private readonly userService: UserService) {
        super();
    }

    /**
     * 用户分页列表
     *
     * @param {QueryUserDto} { page, limit, actived }
     * @returns
     * @memberof UserController
     */
    @Get()
    @UseGuards(JwtAuthGuard)
    async index(@Query() { page, limit, actived }: QueryUserDto) {
        const result = await this.userService.paginate(
            {
                actived,
            },
            { page, limit },
        );
        return {
            ...result,
            items: classToPlain(result.items, {
                groups: ['user-list'],
            }),
        };
    }

    /**
     * 一个用户的详细信息
     *
     * @param {User} user
     * @returns {Promise<User>}
     * @memberof UserController
     */
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @SerializeOptions({
        groups: ['user-item'],
    })
    show(
        @Param('id', new ParseUUIDEntityPipe(User))
        user: User,
    ): Promise<User> {
        return this.userService.findOneById(user.id);
    }

    /**
     * 更新用户信息
     *
     * @param {UpdateUserDto} updateUserDto
     * @returns {Promise<User>}
     * @memberof UserController
     */
    @Patch()
    @UseGuards(JwtAuthGuard)
    @SerializeOptions({
        groups: ['user-item'],
    })
    async update(
        @Body()
        updateUserDto: UpdateUserDto,
    ): Promise<User> {
        return await this.userService.update(updateUserDto);
    }

    /**
     * 删除用户信息
     *
     * @param {User} user
     * @returns
     * @memberof UserController
     */
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @SerializeOptions({
        groups: ['user-item'],
    })
    async destroy(@Param('id', new ParseUUIDEntityPipe(User)) user: User) {
        return await this.userService.delete(user);
    }
}
