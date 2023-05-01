import { ObjectIdValidationPipe } from 'src/common/objectId-validation.pipe';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { Body, Controller, Get, Put, Request, UseGuards, Post, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { Param, UploadedFile, UseInterceptors, UsePipes } from '@nestjs/common/decorators';
import { RolesGuard } from 'src/common/role-guard.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from "uuid";
import { CreateUserDto } from './dto/create-user.dto';
import { ForbiddenTransactionModeOverrideError } from 'typeorm';

@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: "./public/uploads",
            filename: (req, file, cb) => {
                cb(null, `${uuidv4()}-${file.originalname}`)
            }
        }),
    }))
    async createUser(@Body() createUserDto: CreateUserDto, @UploadedFile() file: Express.Multer.File) {


        return await this.usersService.create(createUserDto, file?.filename)
    }
    @Get()
    async findUsers(@Request() req: any) {
        console.log(req.user)
        return await this.usersService.findAll()
    }

    @Get("/:id")
    async findUser(@Request() req: any, @Param("id", ObjectIdValidationPipe) id: string) {

        const user = await this.usersService.findUser(id)

        return {
            user
        }
    }

    @Put("/:id")
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: "./public/uploads",
            filename: (req, file, cb) => {
                cb(null, `${uuidv4()}-${file.originalname}`)
            }
        }),
    }))

    async updateUser(@Request() req: any, @Body() updateUserDto: UpdateUserDto, @Param("id", ObjectIdValidationPipe) id: string, @UploadedFile() file: Express.Multer.File) {
        console.log(updateUserDto)
        if (req.user.role !== "admin" && req.body.role) {
            if (file?.filename) this.usersService.deleteImage(file.filename)
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        }

        const user = await this.usersService.update(id, updateUserDto, file?.filename)

        return {
            user
        }
    }

    @Delete("/:id")
    async deleteUser(@Request() req: any, @Param("id", ObjectIdValidationPipe) id: string) {

        await this.usersService.delete(id)

        return { message: "user is deleted" }
    }

}
