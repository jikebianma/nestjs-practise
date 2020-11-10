import { DtoValidationoOptions } from '@/core';
import { Injectable } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

/**
 * 用户登录凭证
 *
 * @export
 * @class CredentialDto
 */
@Injectable()
@DtoValidationoOptions({
    type: 'query',
    skipMissingProperties: true,
})
export class QueryUserDto {
    @Transform((value) => JSON.parse(value.toLowerCase()))
    @IsBoolean()
    @IsOptional()
    actived?: boolean;

    @Transform((value) => Number(value))
    @IsNumber()
    @IsOptional()
    page = 1;

    @Transform((value) => Number(value))
    @IsNumber()
    @IsOptional()
    limit = 10;
}
