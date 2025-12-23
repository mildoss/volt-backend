import {Controller, Get, UseGuards} from '@nestjs/common';
import { UsersService } from './users.service';
import {AuthGuard} from "@nestjs/passport";
import {CurrentUser} from "../auth/decorators/user.decorator";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@CurrentUser('id') id: number) {
    return this.usersService.findById(id);
  }
}
