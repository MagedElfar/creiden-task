import { IsNotEmpty, IsEmail, Length, MaxLength } from "class-validator";

export class SignUpDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Length(8)
    @MaxLength(20)
    password: string
}