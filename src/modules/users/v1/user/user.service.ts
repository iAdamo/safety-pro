import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from '@schemas/users.schema';
import { CreateUserDto } from '@dto/create-user.dto';
import { UpdateUserDto } from '@dto/update-user.dto';

@Injectable()
export class UserServiceV1 {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(query: { id?: string; email?: string }): Promise<User> {
    const { id, email } = query;
    let user: User | null;

    if (id) {
      user = await this.userModel.findById(id).exec();
    } else if (email) {
      user = await this.userModel.findOne({ email }).exec();
    } else {
      throw new BadRequestException('Query is required');
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.userModel.findByIdAndDelete(id).exec();
  }

  async updateLocation(
    id: string,
    latitude: number,
    longitude: number,
  ): Promise<User> {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const location = {
      type: 'Point',
      coordinates: [latitude, longitude],
    };

    return this.userModel
      .findByIdAndUpdate(id, { location }, { new: true })
      .exec();
  }
}
