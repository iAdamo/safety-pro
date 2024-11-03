import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { UserControllerV1 } from '@controllers/user.controller';
import { UserServiceV1 } from '@services/user.service';
import { CreateUserDto } from '@dto/create-user.dto';
import { UpdateUserDto } from '@dto/update-user.dto';


describe('UserControllerV1', () => {
  let controller: UserControllerV1;
  let service: UserServiceV1;

  beforeEach(async () => {
    const mockUserService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      updateLocation: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserControllerV1],
      providers: [
        {
          provide: UserServiceV1,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserControllerV1>(UserControllerV1);
    service = module.get<UserServiceV1>(UserServiceV1);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const result = { id: '1', ...createUserDto };
      jest.spyOn(service, 'create').mockResolvedValue(result as any);

      expect(await controller.create(createUserDto)).toBe(result);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = [{ id: '1', email: 'test@example.com', firstName: 'John', lastName: 'Doe' }];
      jest.spyOn(service, 'findAll').mockResolvedValue(result as any);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const result = { id: '1', email: 'test@example.com', firstName: 'John', lastName: 'Doe' };
      jest.spyOn(service, 'findOne').mockResolvedValue(result as any);

      expect(await controller.findOne('1')).toBe(result);
    });

    it('should throw a not found exception if user does not exist', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = { firstName: 'Jane' };
      const result = { id: '1', email: 'test@example.com', firstName: 'Jane', lastName: 'Doe' };
      jest.spyOn(service, 'update').mockResolvedValue(result as any);

      expect(await controller.update('1', updateUserDto)).toBe(result);
    });

    it('should throw a not found exception if user does not exist', async () => {
      const updateUserDto: UpdateUserDto = { firstName: 'Jane' };
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException());

      await expect(controller.update('1', updateUserDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const result = { id: '1', email: 'test@example.com', firstName: 'John', lastName: 'Doe' };
      jest.spyOn(service, 'remove').mockResolvedValue(result as any);

      expect(await controller.remove('1')).toBe(result);
    });

    it('should throw a not found exception if user does not exist', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException());

      await expect(controller.remove('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateLocation', () => {
    it('should update the user location', async () => {
      const locationDto = { latitude: 40.7128, longitude: -74.0060 };
      const result = { id: '1', email: 'test@example.com', location: { type: 'Point', coordinates: [40.7128, -74.0060] } };
      jest.spyOn(service, 'updateLocation').mockResolvedValue(result as any);

      expect(await controller.updateLocation('1', locationDto)).toBe(result);
    });

    it('should throw a not found exception if user does not exist', async () => {
      const locationDto = { latitude: 40.7128, longitude: -74.0060 };
      jest.spyOn(service, 'updateLocation').mockRejectedValue(new NotFoundException());

      await expect(controller.updateLocation('1', locationDto)).rejects.toThrow(NotFoundException);
    });
  });
});