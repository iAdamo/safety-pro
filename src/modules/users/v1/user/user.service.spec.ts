import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import {
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { UserServiceV1 } from '@services/user.service';
import { User } from '@schemas/users.schema';
import { CreateUserDto } from '@dto/create-user.dto';
import { UpdateUserDto } from '@dto/update-user.dto';


class MockUserModel {
  constructor(private data: CreateUserDto) {
    this.save = jest.fn().mockResolvedValue(this.data);
  }
  static find = jest.fn().mockReturnThis();
  static findOne = jest.fn().mockReturnThis();
  static findById = jest.fn().mockReturnThis();
  static findByIdAndUpdate = jest.fn().mockReturnThis();
  static findByIdAndDelete = jest.fn().mockReturnThis();
  exec = jest.fn();
  save = jest.fn();
}

describe('UserServiceV1', () => {
  let service: UserServiceV1;
  let model: typeof MockUserModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserServiceV1,
        {
          provide: getModelToken(User.name),
          useValue: MockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserServiceV1>(UserServiceV1);
    model = module.get(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const result = { ...createUserDto };
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const createdUser = new MockUserModel(createUserDto);
      createdUser.save = jest.fn().mockResolvedValue(result);

      expect(await service.create(createUserDto)).toEqual(result);
    });

    it('should throw a conflict exception if user already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(createUserDto),
      });

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
    });

    it('should throw a bad request exception if email is missing', async () => {
      const createUserDto: CreateUserDto = {
        email: '',
        password: 'password123',
      };

      await expect(service.create(createUserDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw a bad request exception if password is missing', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: '',
      };

      await expect(service.create(createUserDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = [{ id: '1', email: 'test@example.com', firstName: 'John', lastName: 'Doe', username: 'johndoe' }];
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue(result),
      });

      expect(await service.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const result = { id: '1', email: 'test@example.com', firstName: 'John', lastName: 'Doe', username: 'johndoe' };
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(result),
      });

      expect(await service.findOne('1')).toEqual(result);
    });

    it('should throw a not found exception if user does not exist', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = { firstName: 'Jane' };
      const result = { id: '1', email: 'test@example.com', firstName: 'Jane', lastName: 'Doe', username: 'johndoe' };
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(result),
      });
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(result),
      });

      expect(await service.update('1', updateUserDto)).toEqual(result);
    });

    it('should throw a not found exception if user does not exist', async () => {
      const updateUserDto: UpdateUserDto = { firstName: 'Jane' };
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.update('1', updateUserDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const result = { id: '1', email: 'test@example.com', firstName: 'John', lastName: 'Doe', username: 'johndoe' };
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(result),
      });
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(result),
      });

      expect(await service.remove('1')).toEqual(result);
    });

    it('should throw a not found exception if user does not exist', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateLocation', () => {
    it('should update the user location', async () => {
      const id = '1';
      const latitude = 40.7128;
      const longitude = -74.0060;
      const user = { id, email: 'test@example.com', location: { type: 'Point', coordinates: [0, 0] } };
      const updatedUser = { ...user, location: { type: 'Point', coordinates: [longitude, latitude] } };

      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(user),
      });
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedUser),
      });

      expect(await service.updateLocation(id, latitude, longitude)).toEqual(updatedUser);
    });

    it('should throw a not found exception if user does not exist', async () => {
      const id = '1';
      const latitude = 40.7128;
      const longitude = -74.0060;
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.updateLocation(id, latitude, longitude)).rejects.toThrow(NotFoundException);
    });
  });
});
