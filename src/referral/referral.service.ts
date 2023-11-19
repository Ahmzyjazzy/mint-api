import { Injectable } from '@nestjs/common';
import { User, UserReferral } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReferralService {
    constructor(
        private prisma: PrismaService,
    ) { }

    async createReferralMapping(newUser: User, refereeUser: User): Promise<UserReferral> {
        // find user by email
        const referral = await this.prisma.userReferral.create({
            data: {
                newUserId: newUser.id,
                refereeUserId: refereeUser.id
            }
        })
        
        return referral
    }

    async getRefereeUserByReferralId(referralId: string): Promise<User | null> {
        // find user by email
        const refereeUser = await this.prisma.user.findUnique({
            where: {
                referralId: referralId
            }
        })

        return refereeUser
    }

    async getRefereeUserByPhone(inputPhoneNumber: string, countryDialCode: string): Promise<User | null> {
        // find user by phone
        if (!inputPhoneNumber.match(/\d/g)) return null

        const phone = this.prisma.cleanPhoneNumber(inputPhoneNumber, countryDialCode)
        const refereeUser = await this.prisma.user.findUnique({
            where: {
                phone: phone
            }
        })

        return refereeUser
    }
}
