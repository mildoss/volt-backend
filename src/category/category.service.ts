import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.category.findMany({
      select: { id: true, name: true },
    });
  }

  async create(name: string) {
    return this.prisma.category.create({
      data: { name },
    });
  }

  async delete(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    if (category._count.products > 0) {
      throw new BadRequestException(
        `Cannot delete category. It has ${category._count.products} products.`,
      );
    }

    return this.prisma.category.delete({
      where: { id },
    });
  }
}
