import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
import { UserModule } from '../user/user.module';
import { ReferralModule } from '../referral/referral.module';

@Module({
  imports: [
    UserModule,
    JwtModule.register({}),
    ReferralModule
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
