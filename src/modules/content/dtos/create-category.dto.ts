import {
    DtoValidationoOptions,
    IsModelExist,
    IsTreeUnique,
    IsTreeUniqueExist,
} from '@/core';
import { Injectable } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsUUID,
    MaxLength,
} from 'class-validator';
import { getManager } from 'typeorm';
import { Category } from '../entities';
import { CategoryRepository } from '../repositories';
import { UpdateCategoryDto } from './update-category.dto';

/**
 * 分类添加数据验证
 *
 * @export
 * @class CreateCategoryDto
 */
@Injectable()
@DtoValidationoOptions({ groups: ['create'] })
export class CreateCategoryDto {
    // 在create组下必填
    @IsNotEmpty({ groups: ['create'], message: '分类名称不得为空' })
    @MaxLength(25, {
        always: true,
        message: '分类名称长度不能超过$constraint1',
    })
    @IsTreeUnique(
        { entity: Category },
        {
            groups: ['create'],
            message: '分类名称重复',
        },
    )
    @IsTreeUniqueExist(
        { entity: Category },
        {
            groups: ['update'],
            message: '分类名称重复',
        },
    )
    name!: string;

    // 在create组下必填
    @IsOptional({ always: true })
    @MaxLength(50, {
        always: true,
        message: '分类别名长度不能超过$constraint1',
    })
    @IsTreeUnique(
        { entity: Category },
        {
            groups: ['create'],
            message: '分类别名重复',
        },
    )
    @IsTreeUniqueExist(
        { entity: Category },
        {
            groups: ['update'],
            message: '分类别名重复',
        },
    )
    slug?: string;

    @Transform((value) => Number(value))
    @IsNumber(undefined, { message: '排序必须为整数' })
    @IsOptional()
    order?: number;

    // 总是可选
    @IsOptional({ always: true })
    @IsUUID(undefined, { always: true, message: '分类ID格式不正确' })
    @IsModelExist(Category, { always: true, message: '父分类不存在' })
    parent?: Category;

    async transform(obj: CreateCategoryDto | UpdateCategoryDto) {
        const em = getManager();
        if (obj.parent) {
            obj.parent = await em
                .getCustomRepository(CategoryRepository)
                .findOneOrFail(obj.parent);
        }
        return obj;
    }
}
