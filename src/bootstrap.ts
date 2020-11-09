import { Database } from '@/core';
import { Module } from '@nestjs/common';
import * as configs from './config';
import { CoreModule } from './core';
import { ContentModule } from './modules/content';
import { UserModule } from './modules/user';
import { routes } from './routes';

@Module({
    imports: [
        CoreModule.forRoot(configs, { routes, enabled: [Database] }),
        UserModule,
        ContentModule,
    ],
    controllers: [],
    providers: [],
})
export class Bootstrap {}
