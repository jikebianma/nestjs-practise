import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { UserModule } from '../user';
import * as constollerMaps from './controllers';
import * as dtoMaps from './dtos';
import * as entitieMaps from './entities';
import * as repoMaps from './repositories';
import * as serviceMaps from './services';
import * as subscriberMaps from './subscribers';

const entities = Object.values(entitieMaps);
const repositories = Object.values(repoMaps);
const subscribers = Object.values(subscriberMaps);
const dtos = Object.values(dtoMaps);
const services = Object.values(serviceMaps);
const controllers = Object.values(constollerMaps);
const providers = [...subscribers, ...dtos, ...services];
@Module({
    imports: [
        // UserModule,
        TypeOrmModule.forFeature([...entities, ...repositories]),
    ],
    controllers,
    providers,
    exports: [...services, TypeOrmModule.forFeature(repositories)],
})
export class ContentModule {}
