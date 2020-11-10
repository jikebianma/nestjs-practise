import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities';
@EntityRepository(User)
export class UserRepository extends Repository<User> {
    buildBaseQuery() {
        return this.createQueryBuilder('u')
            .leftJoinAndSelect('u.parent', 'up')
            .leftJoinAndSelect('u.enterprise', 'e')
            .leftJoinAndSelect('u.departs', 'd')
            .leftJoinAndSelect('e.apps', 'ea')
            .leftJoinAndSelect('ea.permissions', 'eap')
            .leftJoinAndSelect('u.roles', 'r')
            .leftJoinAndSelect('r.permissions', 'rp')
            .leftJoinAndSelect('u.permissions', 'p');
    }
}
