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
// import { classToPlain } from 'class-transformer';
// import { QueryUserDto, UpdateUserDto } from '../../dtos';
// import { User } from '../../entities';
// import { JwtAuthGuard } from '../../guards';
import { UserService } from '../../services';

@Controller('manage')
export class UserController extends BaseController {
    constructor(private readonly userService: UserService) {
        super();
        this.userService;
    }

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

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @SerializeOptions({
        groups: ['user-item'],
    })
    show(
        @Param('id', new ParseUUIDEntityPipe(User))
        user: User,
    ): Promise<User> {
        return this.userService.findOneByIdOrFail(user.id);
    }

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

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @SerializeOptions({
        groups: ['user-item'],
    })
    async remove(@Param('id', new ParseUUIDEntityPipe(User)) user: User) {
        return await this.userService.remove(user);
    }
}
