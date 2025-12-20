import {Body, Controller, Param, Post, UseGuards} from '@nestjs/common';
import {ReviewsService} from './reviews.service';
import {AuthGuard} from "@nestjs/passport";
import {CurrentUser} from "../auth/decorators/user.decorator";
import {CreateReviewDto} from "./dto/create-review.dto";

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('leave/:productId')
  async create(
    @CurrentUser('id') userId: number,
    @Body() dto: CreateReviewDto,
    @Param('productId') productId: string
  ) {
    return this.reviewsService.create(userId, dto, +productId);
  }
}
