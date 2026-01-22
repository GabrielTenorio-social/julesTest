import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

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
    const user = this.userRepository.create({
      ...rest,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    let hashedPassword = user.password;
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      hashedPassword = await bcrypt.hash(updateUserDto.password, salt);
    }

    const updatedUser = {
      ...user,
      ...updateUserDto,
      password: hashedPassword,
    };
    await this.userRepository.update(id, updatedUser);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }
}
