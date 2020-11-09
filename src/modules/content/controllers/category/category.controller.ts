import { BaseController, ParseUUIDEntityPipe } from '@/core';
import { CreateCategoryDto, UpdateCategoryDto } from '@/modules/content/dtos';
import { CategoryService } from '@/modules/content/services';
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { Category } from '../../entities';

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
    async show(
        @Param('id', new ParseUUIDEntityPipe(Category)) category: Category,
    ) {
        return this.categoryService.findOneOrFail(category.id);
    }

    @Post()
    async store(
        @Body()
        data: CreateCategoryDto,
    ) {
        return this.categoryService.create(data);
    }

    @Patch()
    async update(
        @Body()
        data: UpdateCategoryDto,
    ) {
        return this.categoryService.update(data);
    }

    @Delete(':id')
    async destroy(
        @Param('id', new ParseUUIDEntityPipe(Category)) category: Category,
    ) {
        return this.categoryService.delete(category.id);
    }
}
