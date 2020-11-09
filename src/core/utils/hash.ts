import bcrypt from 'bcrypt';
import { BaseUtil, IConfigMaps } from './base';

/**
 * Bcrypt密码设置
 *
 * @export
 * @class HashUtil
 */
export class Hash extends BaseUtil<number> {
    protected configMaps: IConfigMaps = {
        required: true,
        maps: 'app.hash',
    };

    create(config: number) {
        this.config = config;
    }

    /**
     * 加密明文密码
     *
     * @param {string} password
     * @returns
     * @memberof HashUtil
     */
    encry(password: string) {
        return bcrypt.hashSync(password, this.config);
    }

    /**
     * 验证密码
     *
     * @param {string} password
     * @param {string} hashed
     * @returns
     * @memberof HashUtil
     */
    check(password: string, hashed: string) {
        return bcrypt.compareSync(password, hashed);
    }
}
