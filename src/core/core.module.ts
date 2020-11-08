import { database } from '@/config';
import { routes } from '@/routes';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouterModule } from 'nest-router';

@Global()
@Module({
    imports: [TypeOrmModule.forRoot(database), RouterModule.forRoutes(routes)],
})
export class CoreModule {}
