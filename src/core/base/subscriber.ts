import {
    Connection,
    EntityManager,
    EntitySubscriberInterface,
    EventSubscriber,
    getConnection,
    ObjectType,
    UpdateEvent,
} from 'typeorm';
import { getCurrentDb } from '../helpers';

@EventSubscriber()
export abstract class BaseSubscriber<T>
    implements EntitySubscriberInterface<T> {
    protected em!: EntityManager;

    /**
     * 如果有自动注入的连接实例则属于Nestjs运行时否则处于cli状态
     * @memberof BaseSubscriber
     */
    constructor(protected connection?: Connection) {
        if (this.connection) {
            this.connection.subscribers.push(this);
        } else {
            this.connection = getConnection(getCurrentDb('name'));
        }
        this.em = this.connection.manager;
    }

    abstract listenTo(): ObjectType<T>;

    protected isUpdated<E>(cloumn: keyof E, event: UpdateEvent<E>) {
        return event.updatedColumns.find(
            (item) => item.propertyName === cloumn,
        );
    }
}
