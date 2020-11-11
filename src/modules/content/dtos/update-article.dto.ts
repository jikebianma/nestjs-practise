import { DtoValidationoOptions, IsModelExist, PartialDto } from '@/core';
import { Injectable } from '@nestjs/common';
import { IsDefined, IsUUID } from 'class-validator';
import { Article } from '../entities';
import { CreateArticleDto } from './create-article.dto';

/**
 * 文章更新数据验证
 *
 * @export
 * @class UpdateArticleDto
 * @extends {PartialDto(CreateArticleDto)}
 */
@Injectable()
@DtoValidationoOptions({ skipMissingProperties: true, groups: ['update'] })
export class UpdateArticleDto extends PartialDto(CreateArticleDto) {
    // 在create组下必填
    @IsDefined({ groups: ['update'], message: '文章ID必须指定' })
    @IsUUID(undefined, { groups: ['update'], message: '文章ID格式错误' })
    @IsModelExist(Article, { groups: ['update'], message: '指定的文章不存在' })
    id!: string;
}
