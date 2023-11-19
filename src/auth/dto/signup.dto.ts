import {
    IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString
} from "class-validator"

export class SignupDto {
    @IsString()
    @IsNotEmpty()
    firstname: string

    @IsString()
    @IsNotEmpty()
    lastname: string

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsNumberString()
    @IsNotEmpty()
    phone: string

    @IsString()
    @IsNotEmpty()
    password: string

    @IsString()
    @IsNotEmpty()
    country: string

    @IsString()
    @IsNotEmpty()
    countryCode: string

    @IsNumberString()
    @IsNotEmpty()
    countryDialCode: string

    @IsOptional()
    @IsString()
    referrer: string
}