import { Controller, Post, Body, Res } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class JwtController {
  constructor(private readonly jwtService: JwtService) {}

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
}
