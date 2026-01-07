import {Controller, Get, Post, Body, UseGuards} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import {AuthGuard} from "@nestjs/passport";
import {CurrentUser} from "../auth/decorators/user.decorator";

@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async placeOrder(
    @CurrentUser('id') userId: number,
    @Body() dto: CreateOrderDto
  ) {
    return this.orderService.placeOrder(userId, dto);
  }

  @Get()
  async getMyOrders(@CurrentUser('id') userId: number) {
    return this.orderService.getMyOrders(userId);
  }
}
