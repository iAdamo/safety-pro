import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

import { CreateUserDto } from '@dto/create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    example: 'John',
    description: 'The first name of the user',
    required: false,
  })
  firstName?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the user',
    required: false,
  })
  lastName?: string;

  @ApiProperty({
    example: '1234567890',
    description: 'The phone number of the user',
    required: false,
  })
  phoneNumber?: string;

  @ApiProperty({
    example: 'Johnathan',
    description: 'Other names of the user',
    required: false,
  })
  otherNames?: string;

  @ApiProperty({
    example: 'https://example.com/profile.jpg',
    description: 'The profile picture of the user',
    required: false,
  })
  profilePic?: string;

  @ApiProperty({
    example: 'premium',
    description: 'The role of the user',
    required: false,
  })
  role?: string;

  @ApiProperty({
    example: 300,
    description: 'The proximity range of the user',
    required: false,
  })
  proximityRange?: number;

  @ApiProperty({
    example: {
      street: '123 Main St',
      city: 'Lagos',
      state: 'Lagos',
      country: 'Nigeria',
    },
    description: 'The address of the user',
    required: false,
  })
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
  };
}
