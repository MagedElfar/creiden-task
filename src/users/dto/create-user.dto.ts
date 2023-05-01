import { IsEmail, IsNotEmpty, MaxLength, Length, IsOptional, IsIn } from "class-validator";
import { UserRole } from "../user.entity";
import { Transform } from "class-transformer";
const allowedRoles = Object.values(UserRole)

export class CreateUserDto {

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Length(8)
    @MaxLength(20)
    password: string

    @IsOptional()
    @Transform(({ value }) => value.toLowerCase())
    @IsIn(allowedRoles)
    role: UserRole

    image?: string

    imageRelativePath?: string
}