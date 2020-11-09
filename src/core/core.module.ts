import { DynamicModule, Module, ModuleMetadata } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { RouterModule, Routes } from 'nest-router';
import { Gkr } from './gkr';
import { BaseConfig, ConfigRegCollection } from './interface';
import { DtoValidationPipe } from './pipes';
import { Database } from './utils';
import { configure, Configure } from './utils/configure';
import { UtilItem } from './utils/types';

@Module({})
export class CoreModule {
    static forRoot<T extends BaseConfig = BaseConfig>(
        configs: ConfigRegCollection<T>,
        options?: {
            enabled?: UtilItem[];
            routes?: Routes;
        },
    ): DynamicModule {
        Gkr.init(configs);
        if (options?.enabled) {
            Gkr.util.add(...options.enabled);
        }
        const routes = options?.routes ?? [];
        let imports: ModuleMetadata['imports'] = [
            RouterModule.forRoutes(routes),
        ];
        let providers: ModuleMetadata['providers'] = [
            {
                provide: Configure,
                useValue: configure,
            },
            ...Gkr.util.all,
        ];

        if (Gkr.util.has(Database)) {
            imports = [...imports, ...Gkr.util.get(Database)!.register()];
            providers.push(Gkr.util.provider(Database)!);
        }
        const exports = [...providers];
        providers = [
            ...providers,
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
        return {
            module: CoreModule,
            global: true,
            imports,
            providers,
            exports,
        };
    }
}
