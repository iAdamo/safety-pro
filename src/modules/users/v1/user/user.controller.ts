import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserServiceV1 } from '@services/user.service';
import { CreateUserDto } from '@dto/create-user.dto';
import { UpdateUserDto } from '@dto/update-user.dto';
import { User } from '@schemas/users.schema';

import { JwtAuthGuard } from '@auth/jwt/jwt.guard';

@ApiTags('users')
@Controller({ version: '1', path: 'users' })
export class UserControllerV1 {
  constructor(private readonly userService: UserServiceV1) {}

  // api/v1/users
  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  // api/v1/users/1
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne({ id });
  }

  // api/v1/users/1
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  // api/v1/users/1
  @Delete(':id')
  remove(@Param('id') id: string): Promise<User> {
    return this.userService.remove(id);
  }

  // api/v1/users/1/location
  @Patch(':id/location')
  updateLocation(
    @Param('id') id: string,
    @Body() locationDto: { latitude: number; longitude: number },
  ): Promise<User> {
    const { latitude, longitude } = locationDto;
    return this.userService.updateLocation(id, latitude, longitude);
  }
}
