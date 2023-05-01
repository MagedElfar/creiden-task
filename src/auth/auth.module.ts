import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './../users/users.module';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt/dist';
import { AccessTokenStrategy } from './accsessToken.strategy';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule,
    JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, AccessTokenStrategy]
})


export class AuthModule { }
