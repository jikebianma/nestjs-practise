import {
    ConfigRegister,
    DatabaseConfig,
    databasePath,
    env,
    rootPath,
    srcPath,
} from '@/core';

export const database: ConfigRegister<DatabaseConfig> = () => ({
    default: env('OPTION_NAME', 'mysql'),
    enabled: [],
    connections: [
        {
            name: 'sqlite',
            type: 'sqlite',
            database: rootPath(env('DATABASE_PATH', 'database.sqlite')),
        },
        {
            name: 'mysql',
            type: 'mysql',
            host: env('DATABASE_HOST', '127.0.0.1'),
            port: env('DATABASE_PORT', (v) => Number(v), 3306),
            username: env('DATABASE_USERNAME', 'root'),
            password: env('DATABASE_PASSWORD', '123456'),
            database: env('DATABASE_NAME', 'cms'),
        },
        {
            name: 'mysql2',
            type: 'mysql',
            host: env('DATABASE_HOST', '127.0.0.1'),
            port: env('DATABASE_PORT', (v) => Number(v), 3306),
            username: env('DATABASE_USERNAME', 'root'),
            password: env('DATABASE_PASSWORD', '123456'),
            database: env('DATABASE_NAME', 'gkr'),
        },
    ],
    common: {
        charset: 'utf8mb4',
        dropSchema: false,
        synchronize: false,
        logging: ['error'],
        entities: [srcPath('modules/**/entities/**/*.entity{.ts,.js}', false)],
        subscribers: [
            srcPath('modules/**/subscribers/**/*.subscriber{.ts,.js}', false),
        ],
        migrations: [databasePath('migration/**/*{.ts,.js}', false)],
        seeds: [databasePath('seeder/**/*.seed{.js,.ts}', false)],
        factories: [databasePath('factories/**/*.factory{.js,.ts}', false)],
        cli: {
            entitiesDir: srcPath('entities', false),
            migrationsDir: databasePath('migration', false),
            subscribersDir: srcPath('subscribers', false),
        },
    },
});
