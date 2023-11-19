import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { UpdatePasswordDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {

    constructor(private userService: UserService){}

    @Get('me')
    getMe(@GetUser() user: User) {
        return user
    }

    @Patch('password')
    passwordUpdate(
        @GetUser('id') userId: number,
        @Body() updatePasswordDto: UpdatePasswordDto
    ) {
        return this.userService.passwordUpdate(userId, updatePasswordDto)
    }
}
