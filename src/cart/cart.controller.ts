import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { AddToCartDto, UpdateCountDto } from './dto/cart.dto';

@Controller('cart')
@UseGuards(AuthGuard('jwt'))
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@CurrentUser('id') userId: number) {
    return this.cartService.getCart(userId);
  }

  @Post('add')
  async addToCart(
    @CurrentUser('id') userId: number,
    @Body() dto: AddToCartDto,
  ) {
    return this.cartService.addToCart(userId, dto);
  }

  @Patch('count/:itemId')
  async updateCount(
    @CurrentUser('id') userId: number,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCountDto,
  ) {
    return this.cartService.updateCount(userId, +itemId, dto.type);
  }

  @Delete(':itemId')
  async removeFromCart(
    @CurrentUser('id') userId: number,
    @Param('itemId') itemId: string,
  ) {
    return this.cartService.removeFromCart(userId, +itemId);
  }
}
