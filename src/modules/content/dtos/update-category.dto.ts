import { Injectable } from '@nestjs/common';
import { PartialType } from '@nestjs/swagger';
import { IsDefined, IsUUID } from 'class-validator';
import { CreateCategoryDto } from './create-category.dto';

@Injectable()
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
    // 在update组下必填
    @IsDefined({ groups: ['update'], message: '分类ID必须指定' })
    @IsUUID(undefined, { groups: ['update'], message: '分类ID格式错误' })
    id!: string;
}
