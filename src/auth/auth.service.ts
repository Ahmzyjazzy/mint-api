import { ForbiddenException, Injectable } from '@nestjs/common'
import { AuthDto, SignupDto } from './dto'
import { PrismaService } from '../prisma/prisma.service'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as argon from 'argon2'
import { UserService } from '../user/user.service'
import { ReferralService } from '../referral/referral.service'

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private referralService: ReferralService,
        private jwtService: JwtService,
        private config: ConfigService
    ) { }

    async signup(dto: SignupDto) {
        
        try {
            // check if user was referred
            let refereeUser
            if (dto.referrer) {
                refereeUser = await this.referralService.getRefereeUserByReferralId(dto.referrer) ??
                    await this.referralService.getRefereeUserByPhone(dto.referrer, dto.countryDialCode)

                if (!refereeUser)
                    throw new ForbiddenException('Referral does not exist or Invalid referrer value supplied')
            }

            // save new user in the db
            const newUser = await this.userService.createUser(dto)

            // save new referrer if exist
            if (refereeUser) {
                const referrer = await this.referralService.createReferralMapping(newUser, refereeUser)
                // todo: send email to notify referee
            }

            // todo: send email to notify new user for account creation
            return this.signToken(newUser.id, newUser.email)
    
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credential taken')
                }
            }
            throw new ForbiddenException(error.message)
        }
    }

    async login(dto: AuthDto) {
        // find matching user
        const user = await this.userService.findOne(dto.username)

        if (!user)
            throw new ForbiddenException('Credentials incorrect')

        const pwMatches = await argon.verify(user.password, dto.password)
        if (!pwMatches)
            throw new ForbiddenException('Credentials incorrect')

        return this.signToken(user.id, user.email)
    }
    
    async signToken(userId: number, email: string): Promise<{ access_token: string }> {
        const payload = {
            sub: userId,
            email
        }
        const secret = this.config.get('JSWT_SECRET')
        const token = await this.jwtService.signAsync(payload, {
            expiresIn: '15m',
            secret
        })

        return {
            access_token: token
        }
    }
}
