import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { PrismaService } from '../prisma.service';
import { PaginationService } from '../pagination/pagination.service';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService, PrismaService, PaginationService],
})
export class ReviewsModule {}
