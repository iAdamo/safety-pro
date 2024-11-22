import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { User, UserDocument } from '@schemas/users.schema';
import { Model } from 'mongoose';
import { MailtrapClient } from 'mailtrap';
import { CreateUserDto } from '@dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (!createUserDto.email)
      throw new BadRequestException('Email is required');

    if (!createUserDto.password)
      throw new BadRequestException('Password is required');

    const existingUser = await this.userModel
      .findOne({ email: createUserDto.email })
      .exec();

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  /**
   * Find all users
   * @returns User[]
   */
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  /**
   * Validate user
   * @param email
   * @param password
   * @returns User
   */
  async validateUser(email: string, password: string): Promise<User> {
    if (!email && !password) {
      throw new BadRequestException('Email and password are required');
    }
    const user = await this.userModel.findOne({ email });

    if (user) {
      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Password is incorrect');
      }

      return user;
    } else {
      throw new UnauthorizedException('Account does not exist');
    }
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user['_id'] };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getVerificationCode({ email }) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    const code = Math.floor(100000 + Math.random() * 900000);
    const codeAt = new Date();

    const user = await this.userModel
      .findOneAndUpdate(
        { email },
        { code, codeAt },
        { new: true, upsert: false },
      )
      .exec();

    if (!user) {
      throw new NotFoundException('Account does not exist');
    }

    const sender = {
      email: 'safetypro@adamocode.me',
      name: 'SafetyPro',
    };
    const recipients = [{ email }];

    const client = new MailtrapClient({ token: process.env.HOST_PASS });

    client
      .send({
        from: sender,
        to: recipients,
        template_uuid: process.env.VERIFICATION_TEMPLATE_UUID,
        template_variables: {
          company_info_name: process.env.COMPANY_NAME,
          first_name: `${user.email}`,
          last_name: `${code}`,
          company_info_country: process.env.COMPANY_COUNTRY,
          company_info_phone: process.env.COMPANY_PHONE,
          email: process.env.COMPANY_EMAIL,
        },
      })
      .then(console.log)
      .catch(console.error);

    return { message: 'Verification code sent' };
  }

  async verifyEmail({ code, email }) {
    if (!code || !email) {
      throw new BadRequestException('Code and email are required');
    }
    const user = await this.userModel.findOne({ email }).exec();
    // check if the code is still valid
    if (user && user.codeAt) {
      const codeAt = new Date(user.codeAt);
      const now = new Date();
      const diff = Math.abs(now.getTime() - codeAt.getTime());
      const diffMinutes = Math.ceil(diff / (1000 * 60));

      if (diffMinutes > 30) {
        throw new BadRequestException('Code has expired');
      }
    }

    if (user.code === code) {
      if (user.verified) {
        await this.userModel
          .findOneAndUpdate(
            { _id: user['_id'] },
            { code: null, codeAt: null, forgetPassword: true },
          )
          .exec();
      } else {
        await this.userModel.findOneAndUpdate(
          user['_id'],
          {
            code: null,
            codeAt: null,
            verified: true,
          },
          { new: true, upsert: false },
        );
      }
      return { message: 'Code verified' };
    }

    throw new BadRequestException('Code is invalid');
  }

  async resetPassword({ email, password }) {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }
    const user = await this.userModel.findOne({ email });

    if (user && user.forgetPassword) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await this.userModel.findOneAndUpdate(
        user['_id'],
        {
          password: hashedPassword,
          forgetPassword: false,
        },
        { new: true, upsert: false },
      );

      return { message: 'Password reset successful' };
    }
  }
}
