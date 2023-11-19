import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { SignupDto } from '../auth/dto';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2'

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

   
    
}
