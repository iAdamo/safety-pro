import { Module } from '@nestjs/common';
import { JwtService } from './jwt/jwt.service';
import { JwtController } from './jwt/jwt.controller';

@Module({
  providers: [JwtService],
  controllers: [JwtController]
})
export class AuthModule {}
