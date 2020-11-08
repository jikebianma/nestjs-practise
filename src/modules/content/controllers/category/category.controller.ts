import { BaseController } from '@/core';
import { CreateCategoryDto, UpdateCategoryDto } from '@/modules/content/dtos';
import { CategoryService } from '@/modules/content/services';
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    ValidationPipe,
} from '@nestjs/common';

@Controller('categories')
export class CategoryController extends BaseController {
    constructor(private categoryService: CategoryService) {
        super();
    }

    @Get()
    async index() {
        return this.categoryService.findTrees();
    }

    @Get(':id')
    async show(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.categoryService.findOneOrFail(id);
    }

    @Post()
    async store(
        @Body(
            new ValidationPipe({
                transform: true,
                forbidUnknownValues: true,
                groups: ['create'],
            }),
        )
        data: CreateCategoryDto,
    ) {
        return this.categoryService.create(data);
    }

    @Patch()
    async update(
        @Body(
            new ValidationPipe({
                transform: true,
                forbidUnknownValues: true,
                skipMissingProperties: true,
                groups: ['update'],
            }),
        )
        data: UpdateCategoryDto,
    ) {
        return this.categoryService.update(data);
    }

    @Delete(':id')
    async destroy(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.categoryService.delete(id);
    }
}
