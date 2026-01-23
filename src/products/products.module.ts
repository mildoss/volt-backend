import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import {PrismaService} from "../prisma.service";
import { PaginationService } from '../pagination/pagination.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService, PaginationService],
})
export class ProductsModule {}
