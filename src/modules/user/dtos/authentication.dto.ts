import { IsNotEmpty } from 'class-validator';

export class AuthenticationDto {
    @IsNotEmpty({ message: '登录凭证不得为空' })
    readonly credential!: string;

    @IsNotEmpty({ message: '密码必须填写' })
    readonly password!: string;
}
