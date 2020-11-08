import { EntityRepository, Repository } from 'typeorm';
import { Article } from '../entities';

@EntityRepository(Article)
export class ArticleRepository extends Repository<Article> {}
