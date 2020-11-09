import { Type } from '@nestjs/common';
import { PartialType } from '@nestjs/swagger';

export function PartialDto<T>(classRef: Type<T>): Type<Partial<T>> {
    const PartialTypeClass = PartialType(classRef);
    if (
        classRef.prototype.transform &&
        typeof classRef.prototype.transform === 'function'
    ) {
        PartialTypeClass.prototype.transform = classRef.prototype.transform;
    }
    return PartialTypeClass;
}

/**
 * 判断一个变量是否为promise对象
 *
 * @export
 * @param {*} o
 * @returns {boolean}
 */
export function isPromiseLike(o: any): boolean {
    return (
        !!o &&
        (typeof o === 'object' || typeof o === 'function') &&
        typeof o.then === 'function' &&
        !(o instanceof Date)
    );
}
