import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { PaginationDto } from '../pagination/dto/pagination.dto';
import { PaginationService } from '../pagination/pagination.service';

@Injectable()
export class ReviewsService {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService,
  ) {}

  async create(userId: number, dto: CreateReviewDto, productId: number) {
    const isExist = await this.prisma.review.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (isExist) {
      throw new BadRequestException(
        'You have already left a review for this product',
      );
    }

    return this.prisma.review.create({
      data: {
        ...dto,
        product: {
          connect: {
            id: productId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async findAll(dto: PaginationDto) {
    const { skip, perPage } = this.paginationService.getPagination(dto);

    const reviews = await this.prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: perPage,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
    });

    const count = await this.prisma.review.count();

    return { items: reviews, length: count };
  }

  async delete(id: number) {
    return this.prisma.review.delete({
      where: { id },
    });
  }
}
