import { DtoValidationoOptions, IsModelExist } from '@/core';
import { Injectable } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
    IsBoolean,
    IsEnum,
    IsNumber,
    IsOptional,
    IsUUID,
} from 'class-validator';
import { ArticleOrderType } from '../constants';
import { Category } from '../entities';

/**
 * 文章列表查询数据验证
 *
 * @export
 * @class QueryArticleDto
 */
@Injectable()
@DtoValidationoOptions({ type: 'query' })
export class QueryArticleDto {
    /**
     * 过滤分类
     *
     * @type {string}
     * @memberof QueryArticleDto
     */
    @IsOptional()
    @IsUUID(undefined, { groups: ['update'], message: '分类ID格式错误' })
    @IsModelExist(Category, { groups: ['update'], message: '指定的分类不存在' })
    category?: string;

    /**
     * 过滤发布状态
     * 不填则显示所有文章
     *
     * @type {boolean}
     * @memberof QueryArticleDto
     */
    @Transform((value) => JSON.parse(value.toLowerCase()))
    @IsBoolean()
    @IsOptional()
    isPublished?: boolean;

    /**
     * 排序方式
     * 不填则综合排序
     *
     * @type {ArticleOrderType}
     * @memberof QueryArticleDto
     */
    @IsEnum(ArticleOrderType, {
        message: `排序规则必须是${Object.values(ArticleOrderType).join(
            ',',
        )}其中一项`,
    })
    @IsOptional()
    orderBy?: ArticleOrderType;

    /**
     * 当前分页
     *
     * @memberof QueryArticleDto
     */
    @Transform((value) => Number(value))
    @IsNumber()
    @IsOptional()
    page = 1;

    /**
     * 每页显示数据
     *
     * @memberof QueryArticleDto
     */
    @Transform((value) => Number(value))
    @IsNumber()
    @IsOptional()
    limit = 10;
}
