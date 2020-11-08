import { Injectable } from '@nestjs/common';
import { IsNotEmpty, IsOptional, IsUUID, MaxLength } from 'class-validator';

@Injectable()
export class CreateArticleDto {
    // 在create组下必填
    @IsNotEmpty({ groups: ['create'], message: '文章标题必须填写' })
    @MaxLength(255, {
        always: true,
        message: '分类名称长度最大为$constraint1',
    })
    title!: string;

    // 在create组下必填
    @IsNotEmpty({ groups: ['create'], message: '文章内容必须填写' })
    body!: string;

    // 总是可选
    @IsOptional({ always: true })
    summary?: string;

    // 总是可选
    @IsOptional({ always: true })
    @MaxLength(20, {
        each: true,
        always: true,
        message: '每个关键字长度最大为$constraint1',
    })
    keywords?: string[];

    // 总是可选
    @IsOptional({ always: true })
    @IsUUID(undefined, { each: true, always: true, message: '分类ID格式错误' })
    categories?: string[];
}
