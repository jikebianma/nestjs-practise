import { Injectable } from '@nestjs/common';
import { PartialType } from '@nestjs/swagger';
import { IsDefined, IsUUID } from 'class-validator';
import { CreateArticleDto } from './create-article.dto';

@Injectable()
export class UpdateArticleDto extends PartialType(CreateArticleDto) {
    // 在update组下必填
    @IsDefined({ groups: ['update'], message: '文章ID必须指定' })
    @IsUUID(undefined, { groups: ['update'], message: '文章ID格式错误' })
    id!: string;
}
