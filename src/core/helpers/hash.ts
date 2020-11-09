import { Gkr } from '../gkr';
import { Hash } from '../utils';

const hasher = () => Gkr.util.get(Hash);
/**
 * 加密明文密码
 *
 * @export
 * @param {string} password
 * @returns
 */
export function encrypt(password: string) {
    return hasher().encry(password);
}

/**
 * 验证密码
 *
 * @export
 * @param {string} password
 * @param {string} hashed
 * @returns
 */
export function decrypt(password: string, hashed: string) {
    return hasher().check(password, hashed);
}
