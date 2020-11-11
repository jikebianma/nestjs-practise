import { BaseController, ParseUUIDEntityPipe } from '@/core';
import { JwtAuthGuard } from '@/modules/user';
// import { JwtAuthGuard } from '@/modules/user';
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

/**
 * 内容分类管理控制器
 *
 * @export
 * @class CategoryController
 * @extends {BaseController}
 */
@Controller('categories')
export class CategoryController extends BaseController {
    constructor(private categoryService: CategoryService) {
        super();
    }

    /**
     * 分类列表
     *
     * @returns
     * @memberof CategoryController
     */
    @Get()
    async index() {
        return this.categoryService.findTrees();
    }

    /**
     * 分类信息
     *
     * @param {Category} category
     * @returns
     * @memberof CategoryController
     */
    @Get(':id')
    async show(
        @Param('id', new ParseUUIDEntityPipe(Category)) category: Category,
    ) {
        return this.categoryService.findOne(category.id);
    }

    /**
     * 添加分类
     *
     * @param {CreateCategoryDto} data
     * @returns
     * @memberof CategoryController
     */
    @Post()
    @UseGuards(JwtAuthGuard)
    async store(
        @Body()
        data: CreateCategoryDto,
    ) {
        return this.categoryService.create(data);
    }

    /**
     * 更新分类
     *
     * @param {UpdateCategoryDto} data
     * @returns
     * @memberof CategoryController
     */
    @Patch()
    @UseGuards(JwtAuthGuard)
    async update(
        @Body()
        data: UpdateCategoryDto,
    ) {
        return this.categoryService.update(data);
    }

    /**
     * 删除分类
     *
     * @param {Category} category
     * @returns
     * @memberof CategoryController
     */
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async destroy(
        @Param('id', new ParseUUIDEntityPipe(Category)) category: Category,
    ) {
        return this.categoryService.delete(category.id);
    }
}
