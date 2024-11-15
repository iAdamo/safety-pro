import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { UserServiceV1 } from '@services/user.service';
import { User } from '@schemas/users.schema';
import * as bcrypt from 'bcrypt';
@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly userServiceV1: UserServiceV1,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userServiceV1.findOne({ email });

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
}
