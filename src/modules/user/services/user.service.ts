import { Injectable } from '@nestjs/common';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { SelectQueryBuilder } from 'typeorm';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { CreateUserDto, UpdateUserDto } from '../dtos';
import { User } from '../entities';
import { UserRepository } from '../repositories';

type FindParams = {
    actived?: boolean;
    disabled?: boolean;
};

type FindHook = (
    hookQuery: SelectQueryBuilder<User>,
) => Promise<SelectQueryBuilder<User>>;

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    /**
     * 创建用户
     *
     * @param {CreateUserDto} data
     * @returns
     * @memberof UserService
     */
    async create(data: CreateUserDto) {
        const user = await this.userRepository.save(data);
        return await this.findOneByIdOrFail(user.id);
    }

    /**
     * 更新用户
     *
     * @param {UpdateUserDto} data
     * @returns
     * @memberof UserService
     */
    async update(data: UpdateUserDto) {
        const user = await this.userRepository.save(data);
        return await this.findOneByIdOrFail(user.id);
    }

    async remove(item: User) {
        return await this.userRepository.remove(item);
    }

    /**
     * 根据用户用户凭证查询用户
     *
     * @param {string} credential
     * @param {FindHook} [callback]
     * @returns {(Promise<User | undefined>)}
     * @memberof UserService
     */
    async findOneByCredential(credential: string, callback?: FindHook) {
        let query = this.userRepository.buildBaseQuery();
        if (callback) {
            query = await callback(query);
        }
        return query
            .where('u.username = :credential', { credential })
            .orWhere('u.phone = :credential', { credential })
            .orWhere('u.email = :credential', { credential })
            .getOne();
    }

    /**
     * 通过 ID查找用户
     *
     * @param {string} id
     * @param {FindHook} [callback]
     * @returns
     * @memberof UserService
     */
    async findOneById(id: string, callback?: FindHook) {
        let query = this.userRepository.buildBaseQuery();
        if (callback) {
            query = await callback(query);
        }
        return query.where('u.id = :id', { id }).getOne();
    }

    /**
     * 根据ID查找用户,查找失败抛出异常
     *
     * @param {string} id
     * @param {FindHook} [callback]
     * @returns
     * @memberof UserService
     */
    async findOneByIdOrFail(id: string, callback?: FindHook) {
        const user = await this.findOneById(id, callback);
        if (!user) {
            throw new EntityNotFoundError(User, id);
        }
        return user;
    }

    /**
     * 根据对象条件查找用户,不存在则抛出异常
     *
     * @param {{ [key: string]: any }} condition
     * @param {FindHook} [callback]
     * @returns
     * @memberof UserService
     */
    async findOneByCondition(
        condition: { [key: string]: any },
        callback?: FindHook,
    ) {
        let query = this.userRepository.buildBaseQuery();
        if (callback) {
            query = await callback(query);
        }
        let firstAdded = false;
        for (const key in condition) {
            if (!firstAdded) {
                query = query.where(`u.${key} = :${key}`, {
                    [key]: condition[key],
                });
                firstAdded = true;
            } else {
                query = query.andWhere(`u.${key} = :${key}`, {
                    [key]: condition[key],
                });
            }
        }
        return query.getOne();
    }

    /**
     * 根据对象条件查找用户
     *
     * @param {{ [key: string]: any }} condition
     * @param {FindHook} [callback]
     * @returns
     * @memberof UserService
     */
    async findOneByConditionOrFail(
        condition: { [key: string]: any },
        callback?: FindHook,
    ) {
        const user = await this.findOneByCondition(condition, callback);
        if (!user) {
            throw new EntityNotFoundError(User, JSON.stringify(condition));
        }
        return user;
    }

    /**
     * 对查询结果进行分页
     *
     * @param {FindParams} params
     * @param {IPaginationOptions} options
     * @returns
     * @memberof UserService
     */
    async paginate(params: FindParams, options: IPaginationOptions) {
        const query = await this.getListQuery(params);
        return await paginate<User>(query, options);
    }

    /**
     * 根据参数构建查询用户列表的Query
     *
     * @protected
     * @param {FindParams} [params={}]
     * @returns
     * @memberof UserService
     */
    protected async getListQuery(params: FindParams = {}) {
        const { actived, disabled } = params;
        let isAdded = false;
        let query = this.userRepository.buildBaseQuery();
        if (actived !== undefined && typeof actived === 'boolean') {
            query = isAdded
                ? query.andWhere('u.actived = :actived', { actived })
                : query.where('u.actived = :actived', { actived });
            isAdded = true;
        }
        if (disabled !== undefined && typeof disabled === 'boolean') {
            query = isAdded
                ? query.andWhere('u.disabled = :disabled', { disabled })
                : query.where('u.disabled = :disabled', { disabled });
            isAdded = true;
        }
        return query;
    }
}
