import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma.service";
import {CreateReviewDto} from "./dto/create-review.dto";

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateReviewDto, productId: number) {
    return this.prisma.review.create({
      data: {
        ...dto,
        product: {
          connect: {
            id: productId
          }
        },
        user: {
          connect: {
            id: userId
          }
        }
      }
    });
  };

  async findAll() {
    return this.prisma.review.findMany();
  }
}
