import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import {AuthGuard} from "@nestjs/passport";
import {CurrentUser} from "../auth/decorators/user.decorator";
import { OnlyAdminGuard } from '../auth/guards/admin.guard';
import { OrderStatus } from '@prisma/client';
import { PaginationDto } from '../pagination/dto/pagination.dto';

@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async placeOrder(
    @CurrentUser('id') userId: number,
    @Body() dto: CreateOrderDto,
  ) {
    return this.orderService.placeOrder(userId, dto);
  }

  @Get()
  async getMyOrders(@CurrentUser('id') userId: number) {
    return this.orderService.getMyOrders(userId);
  }

  @Get('all')
  @UseGuards(AuthGuard('jwt'), OnlyAdminGuard)
  async getAllOrders(@Query() dto: PaginationDto) {
    return this.orderService.getAll(dto);
  }

  @Patch('status/:id')
  @UseGuards(AuthGuard('jwt'), OnlyAdminGuard)
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.orderService.updateStatus(+id, status);
  }
}
