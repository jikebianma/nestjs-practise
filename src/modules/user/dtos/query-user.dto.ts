import { DtoValidationoOptions } from '@/core';
import { Injectable } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { UserOrderType } from '../constants';

/**
 * 查询用户列表数据验证
 *
 * @export
 * @class QueryUserDto
 */
@Injectable()
@DtoValidationoOptions({
    type: 'query',
})
export class QueryUserDto {
    /**
     * 过滤激活状态
     *
     * @type {boolean}
     * @memberof QueryUserDto
     */
    @Transform((value) => JSON.parse(value.toLowerCase()))
    @IsBoolean()
    @IsOptional()
    actived?: boolean;

    /**
     * 排序规则
     *
     * @type {UserOrderType}
     * @memberof QueryUserDto
     */
    @IsEnum(UserOrderType)
    @IsOptional()
    orderBy?: UserOrderType;

    /**
     * 当前分页
     *
     * @memberof QueryUserDto
     */
    @Transform((value) => Number(value))
    @IsNumber()
    @IsOptional()
    page = 1;

    /**
     * 每页显示数据量
     *
     * @memberof QueryUserDto
     */
    @Transform((value) => Number(value))
    @IsNumber()
    @IsOptional()
    limit = 10;
}
