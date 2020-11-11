import { Injectable } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos';
import { CategoryRepository } from '../repositories';

/**
 * 内容分类服务
 *
 * @export
 * @class CategoryService
 */
@Injectable()
export class CategoryService {
    constructor(private categoryRepository: CategoryRepository) {}

    /**
     * 展示树形模式的分类列表
     *
     * @returns
     * @memberof CategoryService
     */
    async findTrees() {
        return await this.categoryRepository.findTrees();
    }

    /**
     * 查询一个分类
     *
     * @param {string} id
     * @returns
     * @memberof CategoryService
     */
    async findOne(id: string) {
        return await this.categoryRepository.findOneOrFail(id);
    }

    /**
     * 创建分类
     *
     * @param {CreateCategoryDto} data
     * @returns
     * @memberof CategoryService
     */
    async create(data: CreateCategoryDto) {
        const item = await this.categoryRepository.save(data);
        return this.findOne(item.id);
    }

    /**
     * 更新分类信息
     *
     * @param {UpdateCategoryDto} data
     * @returns
     * @memberof CategoryService
     */
    async update(data: UpdateCategoryDto) {
        await this.categoryRepository.save(data);
        return await this.findOne(data.id);
    }

    /**
     * 删除分类
     *
     * @param {string} id
     * @returns
     * @memberof CategoryService
     */
    async delete(id: string) {
        const item = await this.findOne(id);
        return await this.categoryRepository.remove(item);
    }
}
