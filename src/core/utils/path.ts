import path from 'path';

/**
 * 路径类
 * 此类主要用于命令行工具,因为命令行是执行在ts-node环境下的
 * 如果是运行时,则需要在启动命令的环境变量中指定_runpath才能使用所有方法
 * 否则只能使用getRootPath方法
 * 如果是使用webpack打包运行
 * 那么就算指定了_runpath,除getRootPath外其它方法也是无效的
 *
 * @export
 * @class Path
 */
export class Path {
    constructor(private readonly _runpath?: string) {}

    /**
     * 获取根目录
     *
     * @returns
     * @memberof Path
     */
    getRootPath() {
        return process.cwd();
    }

    /**
     * 获取源码目录
     *
     * @returns
     * @memberof Path
     */
    getSrcDir() {
        return this._runpath ?? 'src';
    }

    /**
     * 获取源码路径
     *
     * @returns
     * @memberof Path
     */
    getSrcPath() {
        return path.resolve(this.getRootPath(), this.getSrcDir());
    }

    /**
     * 获取配置文件目录
     *
     * @returns
     * @memberof Path
     */
    getConfigDir() {
        return path.join(this.getSrcDir(), 'config');
    }

    /**
     * 获取配置文件路径
     *
     * @returns
     * @memberof Path
     */
    getConfigPath() {
        return path.resolve(this.getRootPath(), this.getConfigDir());
    }

    /**
     * 获取数据库文件目录
     *
     * @returns
     * @memberof Path
     */
    getDbDir() {
        return path.join(this.getSrcDir(), 'database');
    }

    /**
     * 获取数据库配置路径
     *
     * @returns
     * @memberof Path
     */
    getDbPath() {
        return path.resolve(this.getRootPath(), this.getDbDir());
    }
}
