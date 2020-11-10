import { DataFactory } from '@/console/libs';
import { BaseSeeder } from '@/console/libs/database/base.seeder';
import { User } from '@/modules/user/entities';
import { Connection } from 'typeorm';
import { IUserFactoryOptions } from '../factories/user.factory';

export default class UserSeeder extends BaseSeeder {
    protected truncates = [User];

    protected factory!: DataFactory;

    public async run(
        _factory: DataFactory,
        _connection: Connection,
    ): Promise<any> {
        this.factory = _factory;
        await this.loadUsers();
    }

    private async loadUsers() {
        const userFactory = this.factory(User);
        await userFactory<IUserFactoryOptions>({
            username: 'nangongmo',
            nickname: '南宫墨',
            phone: '15157511637',
            password: '123456',
            actived: true,
        }).create();

        await userFactory<IUserFactoryOptions>({
            username: 'lishuai',
            nickname: '李帅',
            phone: '15178787788',
            password: '123456',
            actived: true,
        }).create();

        await userFactory<IUserFactoryOptions>().createMany(15);
    }
}
