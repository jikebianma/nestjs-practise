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
