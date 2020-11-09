import { Injectable } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos';
import { Category } from '../entities';
import { CategoryRepository } from '../repositories';

@Injectable()
export class CategoryService {
    constructor(private categoryRepository: CategoryRepository) {}

    async findTrees() {
        return await this.categoryRepository.findTrees();
    }

    async findOneOrFail(id: string) {
        return await this.categoryRepository.findOneOrFail(id);
    }

    async create(data: CreateCategoryDto) {
        const item = await this.categoryRepository.save(data);
        return this.findOneOrFail(item.id);
    }

    async update(data: UpdateCategoryDto) {
        await this.categoryRepository.save(data);
        return await this.findOneOrFail(data.id);
    }

    async delete(id: string) {
        const item = await this.findOneOrFail(id);
        return await this.categoryRepository.remove(item);
    }

    /**
     * 打平并展开树
     *
     * @param {Category[]} trees
     * @param {string[]} [relations=[]]
     * @returns {Promise<Category[]>}
     * @memberof CategoryService
     */
    async toFlatTrees(
        trees: Category[],
        relations: string[] = [],
    ): Promise<Category[]> {
        const data: Category[] = [];
        for (const tree of trees) {
            const item = await this.categoryRepository.findOne(tree.id, {
                relations,
            });
            data.push(item!);
            data.push(...(await this.toFlatTrees(tree.children, relations)));
        }
        return data;
    }
}
