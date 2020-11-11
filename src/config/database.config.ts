import {
    ConfigRegister,
    DatabaseConfig,
    databasePath,
    env,
    EnviromentType,
    environment,
    rootPath,
    srcPath,
} from '@/core';
/**
 * 数据库配置
 */
export const database: ConfigRegister<DatabaseConfig> = () => {
    // 根据当前环境确定加载`js`还是`ts`文件
    const fileExt = environment() === EnviromentType.PROD ? '.js' : '.ts';
    return {
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
            entities: [
                srcPath(`modules/**/entities/**/*.entity${fileExt}`, false),
            ],
            subscribers: [
                srcPath(
                    `modules/**/subscribers/**/*.subscriber${fileExt}`,
                    false,
                ),
            ],
            migrations: [databasePath(`migration/**/*${fileExt}`, false)],
            seeds: [databasePath(`seeder/**/*.seed${fileExt}`, false)],
            factories: [
                databasePath(`factories/**/*.factory${fileExt}`, false),
            ],
            cli: {
                entitiesDir: srcPath('entities', false),
                migrationsDir: databasePath('migration', false),
                subscribersDir: srcPath('subscribers', false),
            },
        },
    };
};
