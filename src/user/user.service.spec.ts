import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './enums/role.enum';
import { UserService } from './user.service';

jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user with a hashed password', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John',
        lastName: 'Doe',
        birthdate: new Date('1990-01-01'),
        password: 'password',
        role: Role.ANALYST,
      };

      const salt = 'salt';
      const hashedPassword = 'hashedPassword';

      (bcrypt.genSalt as jest.Mock).mockResolvedValue(salt);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const user = await service.create(createUserDto);

      expect(user).toBeDefined();
      expect(user.name).toEqual(createUserDto.name);
      expect(user.lastName).toEqual(createUserDto.lastName);
      expect(user.birthdate).toEqual(createUserDto.birthdate);
      expect(user.password).toEqual(hashedPassword);
      expect(user.role).toEqual(createUserDto.role);

      const users = service.findAll();
      expect(users).toHaveLength(1);
      expect(users[0]).toEqual(user);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John',
        lastName: 'Doe',
        birthdate: new Date('1990-01-01'),
        password: 'password',
        role: Role.ANALYST,
      };
      const user = await service.create(createUserDto);

      const updateUserDto: UpdateUserDto = {
        name: 'Jane',
        password: 'newPassword',
      };

      const salt = 'newSalt';
      const hashedPassword = 'newHashedPassword';

      (bcrypt.genSalt as jest.Mock).mockResolvedValue(salt);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const updatedUser = await service.update(user.id, updateUserDto);

      expect(updatedUser).toBeDefined();
      expect(updatedUser.name).toEqual(updateUserDto.name);
      expect(updatedUser.password).toEqual(hashedPassword);
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John',
        lastName: 'Doe',
        birthdate: new Date('1990-01-01'),
        password: 'password',
        role: Role.ANALYST,
      };
      const user = await service.create(createUserDto);

      const foundUser = service.findOne(user.id);

      expect(foundUser).toEqual(user);
    });

    it('should throw an error if user is not found', () => {
      try {
        service.findOne('non-existent-id');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('User not found');
        expect(error.getStatus()).toEqual(HttpStatus.NOT_FOUND);
      }
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John',
        lastName: 'Doe',
        birthdate: new Date('1990-01-01'),
        password: 'password',
        role: Role.ANALYST,
      };
      const user = await service.create(createUserDto);

      service.remove(user.id);

      const users = service.findAll();
      expect(users).toHaveLength(0);
    });

    it('should throw an error if user to remove is not found', () => {
      try {
        service.remove('non-existent-id');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('User not found');
        expect(error.getStatus()).toEqual(HttpStatus.NOT_FOUND);
      }
    });
  });
});
