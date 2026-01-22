import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Role } from './enums/role.enum';
import { UserService } from './user.service';

jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    jest.clearAllMocks();
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
      const hashedPassword = 'hashedPassword';
      const user = new User({ ...createUserDto, password: hashedPassword });

      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockUserRepository.create.mockReturnValue(user);
      mockUserRepository.save.mockResolvedValue(user);

      const result = await service.create(createUserDto);

      expect(result).toEqual(user);
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 'salt');
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashedPassword,
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(user);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = 'some-id';
      const updateUserDto: UpdateUserDto = {
        name: 'Jane',
        password: 'newPassword',
      };
      const existingUser = new User({
        id: userId,
        name: 'John',
        lastName: 'Doe',
        birthdate: new Date('1990-01-01'),
        password: 'password',
        role: Role.ANALYST,
      });
      const hashedPassword = 'newHashedPassword';
      const updatedUser = { ...existingUser, ...updateUserDto, password: hashedPassword };

      mockUserRepository.findOne.mockResolvedValueOnce(existingUser);
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('newSalt');
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockUserRepository.update.mockResolvedValue(undefined);
      mockUserRepository.findOne.mockResolvedValueOnce(updatedUser);


      const result = await service.update(userId, updateUserDto);

      expect(result.name).toEqual(updateUserDto.name);
      expect(result.password).toEqual(hashedPassword);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const userId = 'some-id';
      const user = new User({ id: userId, name: 'John', lastName: 'Doe', birthdate: new Date() });
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findOne(userId);

      expect(result).toEqual(user);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
    });

    it('should throw an error if user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const userId = 'some-id';
      mockUserRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(userId);

      expect(mockUserRepository.delete).toHaveBeenCalledWith(userId);
    });

    it('should throw an error if user to remove is not found', async () => {
      mockUserRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );
    });
  });
});
