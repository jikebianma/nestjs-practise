import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as constollerMaps from './controllers';
import * as dtoMaps from './dtos';
import * as entitieMaps from './entities';
import * as guardMaps from './guards';
import * as repoMaps from './repositories';
import * as serviceMaps from './services';
import * as strategyMaps from './strategies';
import * as subscriberMaps from './subscribers';

const entities = Object.values(entitieMaps);
const repositories = Object.values(repoMaps);
const subscribers = Object.values(subscriberMaps);
const strategies = Object.values(strategyMaps);
const guards = Object.values(guardMaps);
const dtos = Object.values(dtoMaps);
const services = Object.values(serviceMaps);
const controllers = Object.values(constollerMaps);
const providers = [
    ...subscribers,
    ...strategies,
    ...dtos,
    ...guards,
    ...services,
];
@Module({
    imports: [
        PassportModule,
        TypeOrmModule.forFeature([...entities, ...repositories]),
        serviceMaps.AuthService.jwtModuleFactory(),
    ],
    controllers,
    providers,
    exports: [...services, TypeOrmModule.forFeature(repositories)],
})
export class UserModule {}
