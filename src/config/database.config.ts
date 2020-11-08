import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const database: TypeOrmModuleOptions = {
    type: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'dev',
    password: '12345678r',
    database: 'dev1',
    // 自动同步模型,仅在开发环境使用
    // 后面我们讲完《配置优化》和《自定义命令》后这个配置就不需要了
    synchronize: true,
    // 这个配置为了自动加载模型类,而不去从glob匹配中读取
    // 比如使用webpack打包会打成单文件js,那么通过遍历的方式就无法获取模型
    autoLoadEntities: true,
    // 所有表的表前缀,可选设置
    // entityPrefix: 'jkxk_',
};
