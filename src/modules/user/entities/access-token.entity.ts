import { Entity, ManyToOne, OneToOne } from 'typeorm';
import { BaseToken } from './base.token';
import { RefreshToken } from './refresh-token.entity';
import { User } from './user.entity';

@Entity('user_access_tokens')
export class AccessToken extends BaseToken {
    /**
     * 关联的刷新令牌
     *
     * @type {RefreshToken}
     * @memberof AccessToken
     */
    @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.accessToken, {
        cascade: true,
    })
    refreshToken!: RefreshToken;

    /**
     * 所属用户
     *
     * @type {User}
     * @memberof AccessToken
     */
    @ManyToOne((type) => User, (user) => user.accessTokens, {
        onDelete: 'CASCADE',
    })
    user!: User;
}
