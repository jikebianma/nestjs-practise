import { database } from '@/config';
import { routes } from '@/routes';
import { Global, Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouterModule } from 'nest-router';
import { DtoValidationPipe } from './pipes';

const imports = [
    TypeOrmModule.forRoot(database),
    RouterModule.forRoutes(routes),
];
const providers = [
    {
        provide: APP_PIPE,
        useFactory: () =>
            new DtoValidationPipe({
                transform: true,
                forbidUnknownValues: true,
                validationError: { target: false },
            }),
    },
];
@Global()
@Module({
    imports,
    providers,
})
export class CoreModule {}
