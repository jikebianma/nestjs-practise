import { IsMatchPhone, IsUnique, IsUniqueExist } from '@/core';
import { IsBoolean, IsEmail, IsOptional, Length } from 'class-validator';
import { User } from '../entities';

export class CreateUserDto {
    @Length(3, 20, {
        always: true,
        message: '昵称必须为$constraint1到$constraint2',
    })
    nickname?: string;

    @IsUnique(
        { entity: User },
        {
            groups: ['create'],
            message: '该用户名已被注册',
        },
    )
    @IsUniqueExist(
        { entity: User, ignore: 'id' },
        { groups: ['update'], message: '该用户名已被注册' },
    )
    @Length(8, 50, { always: true })
    username!: string;

    @Length(8, 50, {
        always: true,
        message: '密码长度不得少于$constraint1',
    })
    password!: string;

    @IsUnique(
        { entity: User },
        {
            groups: ['create'],
            message: '该手机号码已被注册',
        },
    )
    @IsUniqueExist(
        { entity: User, ignore: 'id' },
        { groups: ['update'], message: '该手机号码已被注册' },
    )
    @IsMatchPhone(
        undefined,
        { strictMode: true },
        {
            message: '手机格式错误,示例: 15005255555或+86.15005255555',
            always: true,
        },
    )
    @IsOptional({ always: true })
    phone?: string;

    @IsUnique(
        { entity: User },
        {
            groups: ['create'],
            message: '邮箱已被占用',
        },
    )
    @IsUniqueExist(
        { entity: User, ignore: 'id' },
        { groups: ['update'], message: '邮箱已被占用' },
    )
    @IsEmail(undefined, { always: true, message: '邮箱格式错误' })
    @IsOptional({ always: true })
    email?: string;

    @IsBoolean({ always: true, message: 'actived必须为布尔值' })
    @IsOptional({ always: true })
    actived?: boolean;
}
