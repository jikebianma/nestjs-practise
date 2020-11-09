import { getCurrentDb, isPromiseLike } from '@/core';
import Faker from 'faker';
import { ObjectType } from 'typeorm';
import { printError } from '../common';
import { DataFactoryFunction, EntityProperty } from './types';

/**
 * 运行Factory
 */
export class EntityFactory<Entity, Settings> {
    private mapFunction!: (entity: Entity) => Promise<Entity>;

    constructor(
        public name: string,
        public entity: ObjectType<Entity>,
        private readonly factory: DataFactoryFunction<Entity, Settings>,
        private readonly settings?: Settings,
    ) {}

    map(
        mapFunction: (entity: Entity) => Promise<Entity>,
    ): EntityFactory<Entity, Settings> {
        this.mapFunction = mapFunction;
        return this;
    }

    async make(overrideParams: EntityProperty<Entity> = {}): Promise<Entity> {
        if (this.factory) {
            let entity = await this.resolveEntity(
                await this.factory(Faker, this.settings),
            );
            if (this.mapFunction) {
                entity = await this.mapFunction(entity);
            }
            for (const key in overrideParams) {
                if (overrideParams[key]) {
                    entity[key] = overrideParams[key]!;
                }
            }

            return entity;
        }
        throw new Error('Could not found entity');
    }

    async create(overrideParams: EntityProperty<Entity> = {}): Promise<Entity> {
        const connection = getCurrentDb('connection');
        if (connection) {
            const em = connection.createEntityManager();
            try {
                const entity = await this.make(overrideParams);
                return em.save(entity);
            } catch (error) {
                const message = 'Could not save entity';
                printError(message, error);
                throw new Error(message);
            }
        } else {
            const message = 'No db connection is given';
            printError(message);
            throw new Error(message);
        }
    }

    async makeMany(
        amount: number,
        overrideParams: EntityProperty<Entity> = {},
    ): Promise<Entity[]> {
        const list = [];
        for (let index = 0; index < amount; index += 1) {
            list[index] = await this.make(overrideParams);
        }
        return list;
    }

    async createMany(
        amount: number,
        overrideParams: EntityProperty<Entity> = {},
    ): Promise<Entity[]> {
        const list = [];
        for (let index = 0; index < amount; index += 1) {
            list[index] = await this.create(overrideParams);
        }
        return list;
    }

    private async resolveEntity(entity: Entity): Promise<Entity> {
        for (const attribute in entity) {
            if (entity[attribute]) {
                if (isPromiseLike(entity[attribute])) {
                    entity[attribute] = await Promise.resolve(
                        entity[attribute],
                    );
                }

                if (
                    typeof entity[attribute] === 'object' &&
                    !(entity[attribute] instanceof Date)
                ) {
                    const subEntityFactory = entity[attribute];
                    try {
                        if (
                            typeof (subEntityFactory as any).make === 'function'
                        ) {
                            entity[
                                attribute
                            ] = await (subEntityFactory as any).make();
                        }
                    } catch (error) {
                        const message = `Could not make ${
                            (subEntityFactory as any).name
                        }`;
                        printError(message, error);
                        throw new Error(message);
                    }
                }
            }
        }
        return entity;
    }
}
