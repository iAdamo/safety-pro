import { Controller, Post, Body, Res } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '@dto/create-user.dto';

@Controller('auth')
@ApiTags('auth')
export class JwtController {
  constructor(private readonly jwtService: JwtService) {}

  // api/auth/register
  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.jwtService.create(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const user = await this.jwtService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    const token = await this.jwtService.login(user);

    res.cookie('Authentication', token.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 90 * 24 * 60 * 60 * 1000,
      sameSite: 'none',
    });

    return res.status(200).json({
      message: 'Login successful',
      userId: user['_id'],
      email: user.email,
    });
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('Authentication');
    return res.status(200).json({
      message: 'Logout successful',
    });
  }

  @Post('send-code')
  async sendCode(@Body() body: { email: string }) {
    return this.jwtService.getVerificationCode(body);
  }

  @Post('verify-email')
  async verifyEmail(@Body() body: { email: string; code: string }) {
    return this.jwtService.verifyEmail(body);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { email: string; password: string }) {
    return this.jwtService.resetPassword(body);
  }
}
