import { IsNotEmpty, IsString } from "class-validator"

export class ChangePasswordDto {
    @IsString()
    @IsNotEmpty()
    oldpassword: string

    @IsString()
    @IsNotEmpty()
    password: string

    @IsString()
    @IsNotEmpty()
    confirmedPassword: string
}