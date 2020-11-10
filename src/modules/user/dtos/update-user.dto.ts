import { IsModelExist } from '@/core';
import { IsUUID } from 'class-validator';
import { User } from '../entities';

export class UpdateUserDto {
    @IsModelExist(User, { groups: ['update'], message: '用户 $value 不存在' })
    @IsUUID(undefined, { groups: ['update'], message: '用户ID格式不正确' })
    id!: string;
}
