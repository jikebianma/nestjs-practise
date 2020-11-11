/** ************************************ AUTH CONFIG ******************************** */
export interface UserConfig {
    jwt: {
        secret: string;
        token_expired: number;
        refresh_secret: string;
        refresh_token_expired: number;
    };
}
/** ************************************ JWT荷载 ******************************** */
export interface JwtPayload {
    sub: string;
    iat: number;
}

/** ************************************ 由JWT策略解析荷载后存入Rquest.user的对象 ******************************** */
export interface RequestUser {
    id: string;
}
