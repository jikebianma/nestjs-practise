import { BaseController, ParseUUIDEntityPipe } from '@/core';
import { JwtAuthGuard } from '@/modules/user';
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from '../../dtos';
import { Category } from '../../entities';
import { CategoryService } from '../../services';

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
    @UseGuards(JwtAuthGuard)
    async store(
        @Body()
        data: CreateCategoryDto,
    ) {
        return this.categoryService.create(data);
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    async update(
        @Body()
        data: UpdateCategoryDto,
    ) {
        return this.categoryService.update(data);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async destroy(
        @Param('id', new ParseUUIDEntityPipe(Category)) category: Category,
    ) {
        return this.categoryService.delete(category.id);
    }
}
