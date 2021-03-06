import { DataFactory } from '@/console/libs';
import { BaseSeeder } from '@/console/libs/database/base.seeder';
import { Connection } from 'typeorm';
import ContentSeeder from './content.seed';
import UserSeeder from './user.seed';

export default class DatabaseSeeder extends BaseSeeder {
    public async run(
        _factory: DataFactory,
        _connection: Connection,
    ): Promise<any> {
        await this.call(UserSeeder);
        await this.call(ContentSeeder);
    }
}
