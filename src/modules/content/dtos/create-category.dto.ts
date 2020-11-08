import { Injectable } from '@nestjs/common';
import { IsNotEmpty, IsOptional, IsUUID, MaxLength } from 'class-validator';

@Injectable()
export class CreateCategoryDto {
    // 在create组下必填
    @IsNotEmpty({ groups: ['create'], message: '分类名称不得为空' })
    @MaxLength(25, {
        always: true,
        message: '分类名称长度不能超过$constraint1',
    })
    name!: string;

    // 总是可选
    @IsOptional({ always: true })
    @MaxLength(50, {
        always: true,
        message: '分类别名长度不能超过$constraint1',
    })
    slug?: string;

    // 总是可选
    @IsOptional({ always: true })
    @IsUUID(undefined, { always: true, message: '分类ID格式不正确' })
    parent?: string;
}
