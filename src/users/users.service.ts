import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from "bcrypt"
import { HttpException, NotAcceptableException, UnauthorizedException } from '@nestjs/common/exceptions';
import { ObjectId } from 'mongodb';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from "path"

@Injectable()
export class UsersService {

    private logger = new Logger("UserService")

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private configService: ConfigService
    ) { }

    async create(createUserDto: CreateUserDto, imagePath?: string): Promise<User> {

        try {
            const { email, name, password } = createUserDto;

            let user = await this.findOne({ email })

            if (user) throw new BadRequestException("user email is already exist");

            createUserDto.password = await bcrypt.hash(password, 10);

            if (imagePath) {
                createUserDto.image = `${this.configService.get("hostURL")}${imagePath}`;
                createUserDto.imageRelativePath = imagePath
            }

            return await this.userRepository.save(createUserDto)
        } catch (error) {
            if (imagePath) await this.deleteImage(imagePath)
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }

    }

    async findUser(id: string) {
        try {
            const user = await this.findOneById(id);

            if (!user) throw new NotFoundException();

            const { password, ...others } = user
            return others
        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }
    }


    async findOne(data: Partial<User>): Promise<Partial<User>> {
        try {
            const user = await this.userRepository.findOneBy(data);

            return user;
        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }
    }

    async findOneById(id: string): Promise<Partial<User>> {
        try {
            const objectId = new ObjectId(id);

            const user = await this.userRepository.findOneBy({ _id: objectId });

            return user;
        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }
    }

    async findAll(): Promise<Partial<User>[]> {
        try {
            const users = await this.userRepository.find({
                select: ["_id", "email", "name", "image", "role"]
            });

            return users;
        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }
    }

    async update(id: string, updateUserDto: UpdateUserDto, imagePath: string) {

        try {

            const user = await this.findUser(id);

            await this.checkUserUpdate(id, updateUserDto);

            if (imagePath) {
                console.log(imagePath)
                updateUserDto.image = `${this.configService.get("hostURL")}${imagePath}`;
                updateUserDto.imageRelativePath = imagePath
            }


            await this.userRepository.save({
                ...user,
                ...updateUserDto
            })


            if (user?.imageRelativePath && imagePath) await this.deleteImage(user.imageRelativePath)


            return {
                ...user,
                ...updateUserDto
            }

        } catch (error) {
            if (imagePath) await this.deleteImage(imagePath)
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }


    }

    async checkUserUpdate(id: string, updateUserDto: UpdateUserDto) {
        try {

            if (updateUserDto.email) {
                const user = await this.findOne({ email: updateUserDto.email });
                if (user && user?._id?.toString() !== id) throw new NotAcceptableException("user email should be unique");
            }

            return;
        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }


    }


    async delete(id: string): Promise<void> {

        try {
            const user = await this.findUser(id);

            const result = await this.userRepository.delete(id);

            if (!result.affected) {
                throw new NotFoundException("task not found")
            };

            if (user?.imageRelativePath) await this.deleteImage(user.imageRelativePath)
            return;
        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }
    }


    deleteImage(filename: string): Promise<void> {
        const file = path.join(__dirname, "..", '..', 'public', 'uploads', filename);
        return new Promise((resolve, reject) => {
            fs.unlink(file, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }
}
