import { EntityRepository, SelectQueryBuilder, TreeRepository } from 'typeorm';
import { Category } from '../entities';

/**
 * 自定义分类模型的Repository
 *
 * @export
 * @class CategoryRepository
 * @extends {TreeRepository<Category>}
 */
@EntityRepository(Category)
export class CategoryRepository extends TreeRepository<Category> {
    /**
     * 添加排序
     *
     * @returns {Promise<Category[]>}
     * @memberof CategoryRepository
     */
    findRoots(): Promise<Category[]> {
        const escapeAlias = (alias: string) =>
            this.manager.connection.driver.escape(alias);
        const escapeColumn = (column: string) =>
            this.manager.connection.driver.escape(column);
        const parentPropertyName = this.manager.connection.namingStrategy.joinColumnName(
            this.metadata.treeParentRelation!.propertyName,
            this.metadata.primaryColumns[0].propertyName,
        );

        return this.createQueryBuilder('treeEntity')
            .orderBy('treeEntity.order', 'ASC')
            .where(
                `${escapeAlias('treeEntity')}.${escapeColumn(
                    parentPropertyName,
                )} IS NULL`,
            )
            .getMany();
    }

    /**
     * 添加排序
     *
     * @param {string} alias
     * @param {string} closureTableAlias
     * @param {Category} entity
     * @returns {SelectQueryBuilder<Category>}
     * @memberof CategoryRepository
     */
    createDescendantsQueryBuilder(
        alias: string,
        closureTableAlias: string,
        entity: Category,
    ): SelectQueryBuilder<Category> {
        return super
            .createDescendantsQueryBuilder(alias, closureTableAlias, entity)
            .orderBy(`${alias}.order`, 'ASC');
    }

    /**
     * 添加排序
     *
     * @param {string} alias
     * @param {string} closureTableAlias
     * @param {Category} entity
     * @returns {SelectQueryBuilder<Category>}
     * @memberof CategoryRepository
     */
    createAncestorsQueryBuilder(
        alias: string,
        closureTableAlias: string,
        entity: Category,
    ): SelectQueryBuilder<Category> {
        return super
            .createAncestorsQueryBuilder(alias, closureTableAlias, entity)
            .orderBy(`${alias}.order`, 'ASC');
    }

    /**
     * 打平并展开树,直接输出扁平化分类列表
     *
     * @param {Category[]} trees
     * @param {string[]} [relations=[]]
     * @returns {Promise<Category[]>}
     * @memberof CategoryRepository
     */
    async toFlatTrees(
        trees: Category[],
        level: number = 0,
        relations: string[] = [],
    ): Promise<Category[]> {
        const data: Category[] = [];
        for (const tree of trees) {
            const item = await this.findOneOrFail(tree.id, {
                relations,
            });
            item.level = level;
            data.push(item!);
            data.push(
                ...(await this.toFlatTrees(
                    tree.children,
                    level + 1,
                    relations,
                )),
            );
        }
        return data;
    }
}
