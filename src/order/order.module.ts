import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import {PrismaService} from "../prisma.service";
import { PaginationService } from '../pagination/pagination.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, PrismaService, PaginationService],
})
export class OrderModule {}
