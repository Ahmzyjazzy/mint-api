import { Module } from '@nestjs/common';
import { ReferralService } from './referral.service';

@Module({
  providers: [ReferralService],
  exports: [ReferralService]
})
export class ReferralModule {}
