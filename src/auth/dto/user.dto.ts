import {
  IsEmail,
  IsNotEmpty,
  IsEnum,
  IsString,
  Length,
  IsOptional,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { rolesList } from 'src/common/utils/roles';

export class UserDTO {
  @IsString()
  @IsNotEmpty()
  @Length(3, 30)
  userName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsEnum(rolesList)
  role: rolesList;
}

export class UpdateUserDto extends PartialType(UserDTO) {}
