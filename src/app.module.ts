import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { ContentModule } from './modules/content';
import { UserModule } from './modules/user';

@Module({
    imports: [CoreModule, UserModule, ContentModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
