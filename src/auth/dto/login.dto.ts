import { IsNotEmpty } from "class-validator";

export class LoginDto {

    @IsNotEmpty()
    identify: string;

    @IsNotEmpty()
    password: string
}