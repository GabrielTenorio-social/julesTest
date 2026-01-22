import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private users: User[] = [];

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (!createUserDto.password) {
      throw new HttpException(
        'Password is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    const { password, ...rest } = createUserDto;
    const user = new User({
      ...rest,
      password: hashedPassword,
    });
    this.users.push(user);
    return user;
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = this.findOne(id);
    const userIndex = this.users.findIndex((user) => user.id === id);

    let hashedPassword = user.password;
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      hashedPassword = await bcrypt.hash(updateUserDto.password, salt);
    }

    const updatedUser = new User({
      ...user,
      ...updateUserDto,
      password: hashedPassword,
    });
    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  remove(id: string): void {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    this.users.splice(userIndex, 1);
  }
}
