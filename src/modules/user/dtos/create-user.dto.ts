import { IsMatch, IsMatchPhone, IsUnique, IsUniqueExist } from '@/core';
import { IsBoolean, IsEmail, IsOptional, Length } from 'class-validator';
import { User } from '../entities';

/**
 * 创建用户数据验证
 *
 * @export
 * @class CreateUserDto
 */
export class CreateUserDto {
    /**
     * 用户昵称
     *
     * @type {string}
     * @memberof CreateUserDto
     */
    @Length(3, 20, {
        always: true,
        message: '昵称必须为$constraint1到$constraint2',
    })
    nickname?: string;

    /**
     * 唯一用户名,如果不填则自动生成
     *
     * @type {string}
     * @memberof CreateUserDto
     */
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

    /**
     * 用户密码
     *
     * @type {string}
     * @memberof CreateUserDto
     */
    @Length(8, 50, {
        always: true,
        message: '密码长度不得少于$constraint1',
    })
    password!: string;

    @IsMatch('password', { message: '两次输入的密码不相同' })
    plainPassword!: string;

    /**
     * 用户手机号
     *
     * @type {string}
     * @memberof CreateUserDto
     */
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

    /**
     * 用户邮箱
     *
     * @type {string}
     * @memberof CreateUserDto
     */
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

    /**
     * 是否激活
     *
     * @type {boolean}
     * @memberof CreateUserDto
     */
    @IsBoolean({ always: true, message: 'actived必须为布尔值' })
    @IsOptional({ always: true })
    actived?: boolean;
}
