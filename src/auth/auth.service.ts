import { ForbiddenException, Injectable } from '@nestjs/common'
import { AuthDto, SignupDto } from './dto'
import { PrismaService } from 'src/prisma/prisma.service'
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService){}

    async signup(dto: SignupDto) {
        //generate password hash
        const hash = await argon.hash(dto.password)
        
        // save new user in the db
        try {

            const user = await this.prisma.user.create({
                data: {
                    username: '',
                    email: dto.email,
                    phone: dto.phone,
                    password: hash
                }
            })

            delete user.password

            // return saved user
            return user
    
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credential taken')
                }
            }
        }
    }

    async login(dto: AuthDto) {
        // find user by email
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.username
            }
        })

        // if user does not exist throw exception
        if (!user)
            throw new ForbiddenException('Credentials incorrect')

        const pwMatches = await argon.verify(user.password, dto.password)
        // if password is incorrect throw an exception
        if (!pwMatches)
            throw new ForbiddenException('Credentials incorrect')

        delete user.password
        return user
    }
        
}
