import { EntityRepository, TreeRepository } from 'typeorm';
import { Category } from '../entities';

@EntityRepository(Category)
export class CategoryRepository extends TreeRepository<Category> {}
