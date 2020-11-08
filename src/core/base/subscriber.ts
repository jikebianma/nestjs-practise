import {
    Connection,
    EntityManager,
    EntitySubscriberInterface,
    EventSubscriber,
    ObjectType,
    UpdateEvent,
} from 'typeorm';

@EventSubscriber()
export abstract class BaseSubscriber<T>
    implements EntitySubscriberInterface<T> {
    protected em!: EntityManager;

    constructor(protected connection: Connection) {
        this.connection.subscribers.push(this);
        this.em = this.connection.manager;
    }

    abstract listenTo(): ObjectType<T>;

    protected isUpdated<E>(cloumn: keyof E, event: UpdateEvent<E>) {
        return event.updatedColumns.find(
            (item) => item.propertyName === cloumn,
        );
    }
}
