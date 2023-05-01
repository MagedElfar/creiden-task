import { AuthService } from './auth.service';
import { Body, Controller, HttpCode, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request as Req } from 'express';
import { Public } from 'src/common/decorators';
import { SignUpDto } from './dto/signup.dto';

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @UsePipes(new ValidationPipe({
        whitelist: true
    }))
    @Post("signup")
    async signup(@Body() signUpDto: SignUpDto) {
        return this.authService.signUp(signUpDto)
    }

    @Public()
    @UseGuards(AuthGuard('local'))
    @Post("login")
    @HttpCode(200)
    login(@Request() req: Req) {
        return this.authService.login(req.user);
    }

}
