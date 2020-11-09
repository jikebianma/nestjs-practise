import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { getManager, ObjectType } from 'typeorm';

/**
 * 检测一个属性是否为uuid并且其对应的entity实例是否存在
 *
 * @export
 * @class ParseUUIDEntityPipe
 * @implements {PipeTransform<string, Promise<ET>>}
 * @template ET
 */
@Injectable()
export class ParseUUIDEntityPipe<ET>
    implements PipeTransform<string, Promise<ET | undefined>> {
    // private repository: Repository<ET>;
    protected readonly entity: ObjectType<ET>;

    constructor(Entity: ObjectType<ET>) {
        this.entity = Entity;
    }

    async transform(value: string, metadata: ArgumentMetadata) {
        if (value === undefined) return undefined;
        if (!isUUID(value)) {
            throw new BadRequestException('id param must be an UUID');
        }
        const val = await getManager().findOne(this.entity, {
            where: { id: value },
        });
        if (!val) {
            throw new BadRequestException('Validation failed');
        }
        return val;
    }
}
