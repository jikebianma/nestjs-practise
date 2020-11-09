import { AppConfig,ConfigRegister,env } from '@/core';

export const app: ConfigRegister<AppConfig> = () => ({
    debug: env('APP_DEBUG', (v) => JSON.parse(v), true),
    timezone: env('APP_TIMEZONE', 'Asia/Shanghai'),
    locale: env('APP_LOCALE', 'zh-cn'),
    https: env<boolean>('SERVER_HTTPS', (v) => JSON.parse(v), false),
    host: env('SERVER_HOST', 'localhost'),
    port: env<number>('SERVER_PORT', (v) => Number(v), 3000),
    url: env('SERVER_URL', undefined),
    hash: env<number>('PASSWORD_HASH', (v) => Number(v), 10),
});
