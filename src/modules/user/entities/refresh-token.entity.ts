import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { AccessToken } from './access-token.entity';
import { BaseToken } from './base.token';

/**
 * 刷新Token的Token模型
 *
 * @export
 * @class RefreshToken
 * @extends {BaseToken}
 */
@Entity('user_refresh_tokens')
export class RefreshToken extends BaseToken {
    /**
     * 关联的登录令牌
     *
     * @type {AccessToken}
     * @memberof RefreshToken
     */
    @OneToOne(() => AccessToken, (accessToken) => accessToken.refreshToken, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    accessToken!: AccessToken;
}
