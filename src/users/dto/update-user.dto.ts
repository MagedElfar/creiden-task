import { CreateUserDto } from './create-user.dto';
import { IntersectionType, OmitType, PartialType } from '@nestjs/mapped-types';

export class UpdateUserDto extends IntersectionType(
    OmitType(CreateUserDto, ['password'] as const),
) { }
