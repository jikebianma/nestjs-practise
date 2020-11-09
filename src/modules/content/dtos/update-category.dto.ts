import { DtoValidationoOptions, IsModelExist, PartialDto } from '@/core';
import { Injectable } from '@nestjs/common';
import { IsDefined, IsUUID } from 'class-validator';
import { Category } from '../entities';
import { CreateCategoryDto } from './create-category.dto';

@Injectable()
@DtoValidationoOptions({ skipMissingProperties: true, groups: ['update'] })
export class UpdateCategoryDto extends PartialDto(CreateCategoryDto) {
    // 在create组下必填
    @IsDefined({ groups: ['update'], message: '分类ID必须指定' })
    @IsUUID(undefined, { groups: ['update'], message: '分类ID格式错误' })
    @IsModelExist(Category, { groups: ['update'], message: '指定的分类不存在' })
    id!: string;
}
