import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John', description: 'The first name of the user', required: false })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @MinLength(3)
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'The last name of the user', required: false })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @MinLength(3)
  lastName: string;

  @ApiProperty({ example: 'johndoe', description: 'The username of the user', required: false })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @MinLength(3)
  username: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

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
}
