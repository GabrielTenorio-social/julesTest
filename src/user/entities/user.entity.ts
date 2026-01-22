import {
  IsDate,
  IsEnum,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { Role } from '../enums/role.enum';
import { Exclude } from 'class-transformer';

export class User {
  @IsUUID()
  id: string = uuidv4();

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  name: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  lastName: string;

  @IsDate()
  birthdate: Date;

  @IsString()
  @Exclude()
  password?: string;

  @IsEnum(Role)
  role: Role = Role.ANALYST;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
