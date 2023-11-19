import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {

    constructor(config: ConfigService) {
        super({
            datasources: {
                db: {
                    url: config.get('DATABASE_URL')
                }
            }
        })
    }

    cleanDb() {
        return this.$transaction([
            this.userReferral.deleteMany(),
            this.userAccount.deleteMany(),
            this.account.deleteMany(),
            this.profile.deleteMany(),
            this.user.deleteMany()
        ])
    }

    cleanPhoneNumber(inputPhoneNumber: string, countryDialCode: string): string {
        /**
         * only return the phone number part
         * 
         * 08093570289 -> 8093570289
         * 
         * +2348093570289 -> 8093570289
         * +23408093570289 -> 8093570289
         * 
         * 2348093570289 -> 8093570289
         * 23408093570289 -> 8093570289
         */
        let cleanPhoneNumber: string =
            inputPhoneNumber.startsWith('0') ?
                inputPhoneNumber.substring(1, inputPhoneNumber.length) :
                inputPhoneNumber.startsWith('+') ?
                    inputPhoneNumber.substring(4, inputPhoneNumber.length) :
                    (inputPhoneNumber.startsWith(countryDialCode) ?
                        inputPhoneNumber.substring(3, inputPhoneNumber.length) : inputPhoneNumber)

        cleanPhoneNumber = cleanPhoneNumber.trim()

        cleanPhoneNumber = cleanPhoneNumber.startsWith('0') ?
            cleanPhoneNumber.substring(1, cleanPhoneNumber.length) : cleanPhoneNumber

        return cleanPhoneNumber
    }
}
