/**
 * 获取不同类组成的数组的类型
 */
export type ClassesType<T extends Array<any>> = {
    new (...args: any[]): T[number];
}[];

/**
 * 获取一个对象的值类型
 */
export type ValueOf<T> = T[keyof T];
