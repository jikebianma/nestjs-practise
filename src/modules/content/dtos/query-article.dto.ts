import { Injectable } from '@nestjs/common';
import { IsOptional, IsUUID } from 'class-validator';

@Injectable()
export class QueryArticleDto {
    @IsOptional()
    @IsUUID(undefined, { groups: ['update'], message: '分类ID格式错误' })
    category?: string;
}
