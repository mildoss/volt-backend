import {Body, Controller, Get, Param, Patch, UseGuards} from '@nestjs/common';
import { UsersService } from './users.service';
import {AuthGuard} from "@nestjs/passport";
import {CurrentUser} from "../auth/decorators/user.decorator";
import {UpdateUserDto} from "./dto/update-user.dto";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@CurrentUser('id') id: number) {
    return this.usersService.findById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('profile/favorites/:productId')
  async toggleFavorite(
    @CurrentUser('id') id: number,
    @Param('productId') productId: string
  ) {
    return this.usersService.toggleFavorite(id, +productId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('profile')
  async updateProfile(
    @CurrentUser('id') id: number,
    @Body() dto: UpdateUserDto
  ) {
    return this.usersService.updateProfile(id, dto);
  }
}
