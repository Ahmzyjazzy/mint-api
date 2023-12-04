import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt') {
    
    constructor(
        config: ConfigService,
        private prisma: PrismaService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get('JSWT_SECRET'),
        })
    }

    async validate(payload: {
        sub: number
        email: string
    }) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub
            },
            include: {
                profile: true
            }
        })
        delete user.password
        delete user.createdAt
        delete user.updatedAt
        delete user.deletedAt
        delete user.deletedRequest
        delete user.deletedStatus
        delete user.profile.bvn
        delete user.profile.bvnJson
        return user
    }
}