import path from 'path';
import { configure } from '../utils/configure';

export function rootPath(): string;
export function rootPath(joinPath: string): string;

export function rootPath(joinPath?: string): string {
    if (joinPath === undefined) return configure.path.getRootPath();
    return path.resolve(configure.path.getRootPath(), joinPath);
}

export function srcPath(): string;
export function srcPath(absolute: boolean): string;
export function srcPath(joinPath: string): string;
export function srcPath(joinPath: string, absolute: boolean): string;
export function srcPath(joinPath?: string | boolean, absolute = true): string {
    if (joinPath === undefined) return configure.path.getSrcPath();
    if (typeof joinPath === 'boolean')
        return joinPath
            ? configure.path.getSrcPath()
            : configure.path.getSrcDir();
    return absolute
        ? path.resolve(configure.path.getSrcPath(), joinPath)
        : path.join(configure.path.getSrcDir(), joinPath);
}

export function configPath(): string;
export function configPath(absolute: boolean): string;
export function configPath(joinPath: string): string;
export function configPath(joinPath: string, absolute: boolean): string;

export function configPath(
    joinPath?: string | boolean,
    absolute = true,
): string {
    if (joinPath === undefined) return configure.path.getConfigPath();
    if (typeof joinPath === 'boolean')
        return joinPath
            ? configure.path.getConfigPath()
            : configure.path.getConfigDir();
    return absolute
        ? path.resolve(configure.path.getConfigPath(), joinPath)
        : path.join(configure.path.getConfigDir(), joinPath);
}

export function databasePath(): string;
export function databasePath(absolute: boolean): string;
export function databasePath(joinPath: string): string;
export function databasePath(joinPath: string, absolute: boolean): string;

export function databasePath(
    joinPath?: string | boolean,
    absolute = true,
): string {
    if (typeof joinPath === 'boolean')
        return joinPath
            ? configure.path.getDbPath()
            : configure.path.getDbDir();
    return absolute
        ? path.resolve(configure.path.getDbPath(), joinPath!)
        : path.join(configure.path.getDbDir(), joinPath!);
}
