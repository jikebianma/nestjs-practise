import { DtoValidationoOptions, IsModelExist } from '@/core';
import { Injectable } from '@nestjs/common';
import { IsOptional, IsUUID } from 'class-validator';
import { Category } from '../entities';

@Injectable()
@DtoValidationoOptions({ type: 'query' })
export class QueryArticleDto {
    @IsOptional()
    @IsUUID(undefined, { groups: ['update'], message: '分类ID格式错误' })
    @IsModelExist(Category, { groups: ['update'], message: '指定的分类不存在' })
    category?: string;
}
