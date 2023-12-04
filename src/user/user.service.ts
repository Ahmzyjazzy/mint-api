import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { SignupDto } from '../auth/dto';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2'
import { ChangePasswordDto, UpdatePasswordDto } from './dto';

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
    ) { }

    async findOne(username: string): Promise<User> {
        // find user by email
        const user = await this.prisma.user.findUnique({
            where: {
                email: username
            }
        })

        return user
    }

    async findById(userId: number): Promise<User> {
        // find user by email
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        return user
    }

    async createUser(dto: SignupDto): Promise<User> {
        //generate password hash
        const hashPassword = await argon.hash(dto.password)

        // create user
        const phone = this.prisma.cleanPhoneNumber(dto.phone, dto.countryDialCode)
        const user = await this.prisma.user.create({
            data: {
                username: `mint-${dto.firstname}${new Date().getTime()}`,
                email: dto.email,
                phone,
                password: hashPassword
            }
        })

        // create profile
        const profile = await this.prisma.profile.create({
            data: {
                userId: user.id,
                firstName: dto.firstname,
                lastName: dto.lastname
            }
        })

        return user
    }

    async updateUserPassword(userId: number, newPasswordHash: string): Promise<User> {
        const user = await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                password: newPasswordHash,
            }
        })

        return user
    }

    async passwordUpdate(userId: number, dto: UpdatePasswordDto): Promise<User> {
        if (dto.password !== dto.confirmedPassword)
            throw new ForbiddenException('Password do not match')

        const passwordHash = await argon.hash(dto.password)
        const user = await this.updateUserPassword(userId, passwordHash)

        delete user.password
        return user
    }

    async changePassword(userId: number, dto: ChangePasswordDto): Promise<User> {
        if (dto.password !== dto.confirmedPassword)
            throw new ForbiddenException('Password do not match')

        const user = await this.findById(userId)

        if (!user)
            throw new ForbiddenException('Invalid parameter supplied')

        const pwMatches = await argon.verify(user.password, dto.oldpassword)
        if (!pwMatches)
            throw new ForbiddenException('Invalid password supplied')

        const newPasswordHash = await argon.hash(dto.password)
        const updateUser = await this.updateUserPassword(userId, newPasswordHash)

        delete updateUser.password
        return updateUser
    }
   
}
