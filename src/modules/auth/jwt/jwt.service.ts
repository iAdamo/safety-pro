import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { UserServiceV1 } from '@services/user.service';
import { User } from '@schemas/users.schema';
import { Model } from 'mongoose';
import { MailtrapClient } from 'mailtrap';

import * as bcrypt from 'bcrypt';
@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    if (!email && !password) {
      throw new BadRequestException('Email and password are required');
    }
    const user = await this.userModel.findOne({ email });

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Password is invalid');
      }

      return user;
    } else {
      throw new UnauthorizedException('Email is invalid');
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

  async verifyCode({ code }) {
    if (!code) {
      throw new BadRequestException('Code is required');
    }
    const user = await this.userModel.findOne({ code }).exec();
    // check if the code is still valid
    if (user && user.codeAt) {
      const codeAt = new Date(user.codeAt);
      const now = new Date();
      const diff = Math.abs(now.getTime() - codeAt.getTime());
      const diffMinutes = Math.ceil(diff / (1000 * 60));

      if (diffMinutes > 30) {
        throw new BadRequestException('Code has expired');
      }

      // clear the code and codeAt
      await this.userModel
        .findOneAndUpdate(
          { _id: user['_id'] },
          { code: null, codeAt: null, forgetPassword: true },
        )
        .exec();

      return { message: 'Code verified' };
    }
    return { message: 'Code is invalid' };
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
        },
        { new: true, upsert: false },
      );

      return { message: 'Password reset successful' };
    }
  }
}
