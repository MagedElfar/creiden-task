import config from './config/index';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';


@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public', 'uploads'),
      exclude: ['/api*'],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config]
    }),
    TypeOrmModule.forRoot(config().typeOrm),
    AuthModule,
    UsersModule,
  ],
  providers: [{
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },]
})
export class AppModule {
  constructor(private dataSource: DataSource) { }
}
