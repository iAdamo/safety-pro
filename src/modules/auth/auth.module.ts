import { Module } from '@nestjs/common';
import { JwtService } from './jwt/jwt.service';
import { JwtController } from './jwt/jwt.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '90d' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [JwtService, JwtStrategy],
  controllers: [JwtController],
  exports: [JwtService],
})
export class AuthModule {}