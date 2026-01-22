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
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  @IsUUID()
  id: string = uuidv4();

  @Column()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  name: string;

  @Column()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  lastName: string;

  @Column()
  @IsDate()
  birthdate: Date;

  @Column()
  @IsString()
  @Exclude()
  password?: string;

  @Column()
  @IsEnum(Role)
  role: Role = Role.ANALYST;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
