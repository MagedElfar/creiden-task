import { UsersService } from './../users/users.service';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';


@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private configService: ConfigService,
        private usersService: UsersService
    ) {
        super({

            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get("jwt.secret")

        });
    }

    async validate(payload: any) {

        const user = await this.usersService.findOneById(payload.id);

        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}