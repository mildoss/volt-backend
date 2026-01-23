import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { CreateReviewDto } from './dto/create-review.dto';
import { OnlyAdminGuard } from '../auth/guards/admin.guard';
import { PaginationDto } from 'src/pagination/dto/pagination.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('leave/:productId')
  async create(
    @CurrentUser('id') userId: number,
    @Body() dto: CreateReviewDto,
    @Param('productId') productId: string,
  ) {
    return this.reviewsService.create(userId, dto, +productId);
  }

  @Get('all')
  @UseGuards(AuthGuard('jwt'), OnlyAdminGuard)
  async getAll(@Query() dto: PaginationDto) {
    return this.reviewsService.findAll(dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), OnlyAdminGuard)
  async delete(@Param('id') id: string) {
    return this.reviewsService.delete(+id);
  }
}
