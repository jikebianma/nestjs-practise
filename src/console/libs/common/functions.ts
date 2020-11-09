/* eslint-disable global-require */
import chalk from 'chalk';
import glob from 'glob';
import ora from 'ora';
import path from 'path';
import shell from 'shelljs';

/**
 * glob路径配置获取合并后的所有文件
 *
 * @export
 * @param {string[]} filePattern
 * @param {glob.IOptions} [options={}]
 * @param {boolean} [cwd]
 * @returns {string[]}
 */
export function matchGlobs(
    filePattern: string[],
    options: glob.IOptions = {},
    cwd?: boolean,
): string[] {
    return filePattern
        .map((pattern) => {
            return cwd
                ? glob
                      .sync(pattern, options)
                      .map((file) => path.resolve(process.cwd(), file))
                : glob.sync(pattern, options);
        })

        .reduce((acc, filePath) => [...acc, ...filePath]);
}

/**
 * require一个文件并获取其导出的default对象
 *
 * @export
 * @template T
 * @param {string} filePath
 * @returns {T}
 */
export function requireDefault<T>(filePath: string): T {
    const fileObject: {
        [key: string]: T;
    } = require(filePath);
    const keys = Object.keys(fileObject);
    return fileObject[keys[0]];
}

/**
 * 动态require文件
 *
 * @export
 * @param {string[]} filePaths
 * @returns {void}
 */
export function requirePaths(filePaths: string[]): void {
    return filePaths.forEach(require);
}

/**
 * 命令行打应错误
 *
 * @export
 * @param {string} message
 * @param {*} [error]
 */
export function printError(message: string, error?: any) {
    // tslint:disable-next-line
    console.log('\n❌ ', chalk.red(message));
    if (error) {
        // tslint:disable-next-line
        console.error(error);
    }
}

/**
 * 命令行抛出异常并终止运行
 *
 * @export
 * @param {ora.Ora} spinner
 * @param {string} message
 * @param {Error} [error]
 */
export function panic(spinner: ora.Ora, message: string, error?: Error) {
    spinner.fail(message);
    if (error) console.error(error);
    process.exit(1);
}

/**
 * 执行shell命令
 *
 * @export
 * @param {string} command
 * @param {boolean} [pretty=false]
 * @returns
 */
export function execShell(command: string, pretty: boolean = false) {
    return new Promise((resolve, reject) => {
        shell.exec(command, { silent: true }, (code, stdout, stderr) => {
            console.log('\n');
            if (pretty) {
                console.log(
                    code !== 0 && stderr
                        ? chalk.red(stdout)
                        : chalk.green(stdout),
                );
            }
            if (code !== 0 && stderr) {
                return reject(new Error(stderr));
            }
            return resolve();
        });
    });
}
