import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { PrismaService } from '../prisma.service';
import { EnumProductSort, GetAllProductDto } from './dto/get-all-product.dto';
import { Prisma } from '@prisma/client';
import { PaginationService } from '../pagination/pagination.service';
import { PaginationDto } from '../pagination/dto/pagination.dto';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService,
  ) {}

  async create(userId: number, createProductDto: CreateProductDto) {
    const { name, description, price, imageUrl, categoryId, stock, specs } =
      createProductDto;
    return this.prisma.product.create({
      data: {
        name,
        description,
        price,
        imageUrl,
        categoryId,
        stock,
        specs,
        slug: this.generateSlug(name),
        userId,
      },
    });
  }

  async delete(id: number) {
    return this.prisma.product.delete({ where: { id } });
  }

  async update(id: number, dto: CreateProductDto) {
    const { name, description, price, imageUrl, categoryId, stock, specs } =
      dto;

    return this.prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        imageUrl,
        categoryId,
        stock,
        specs,
      },
    });
  }

  async findAll(dto: GetAllProductDto) {
    const { sort, searchTerm, categoryId, minPrice, maxPrice } = dto;
    const { skip, perPage } = this.paginationService.getPagination(dto);

    const prismaSort: Prisma.ProductOrderByWithRelationInput[] = [];

    if (sort === EnumProductSort.LOW_PRICE) prismaSort.push({ price: 'asc' });
    else if (sort === EnumProductSort.HIGH_PRICE)
      prismaSort.push({ price: 'desc' });
    else if (sort === EnumProductSort.OLDEST)
      prismaSort.push({ createdAt: 'asc' });
    else if (sort === EnumProductSort.NEWEST)
      prismaSort.push({ createdAt: 'desc' });
    else prismaSort.push({ createdAt: 'desc' });

    const prismaSearch: Prisma.ProductWhereInput = searchTerm
      ? {
          OR: [
            {
              name: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
            {
              category: {
                name: {
                  contains: searchTerm,
                  mode: 'insensitive',
                },
              },
            },
          ],
        }
      : {};

    if (categoryId) {
      prismaSearch.categoryId = +categoryId;
    }

    if (minPrice || maxPrice) {
      prismaSearch.price = {
        ...(minPrice ? { gte: +minPrice } : {}),
        ...(maxPrice ? { lte: +maxPrice } : {}),
      };
    }

    const products = await this.prisma.product.findMany({
      where: prismaSearch,
      orderBy: prismaSort,
      skip,
      take: perPage,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        imageUrl: true,
        stock: true,
        specs: true,
        createdAt: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const count = await this.prisma.product.count({ where: prismaSearch });

    return { items: products, length: count };
  }

  async findAllForAdmin(dto: PaginationDto) {
    const { skip, perPage } = this.paginationService.getPagination(dto);

    const products = await this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: perPage,
      select: {
        id: true,
        name: true,
        price: true,
        imageUrl: true,
        stock: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: { email: true, fullName: true },
        },
        category: {
          select: { id: true, name: true },
        },
      },
    });

    const count = await this.prisma.product.count();

    return { items: products, length: count };
  }

  async findOne(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        reviews: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    if (!product)
      throw new NotFoundException(
        'No product was found matching your search query.',
      );

    return product;
  }

  async findById(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  private generateSlug(name: string): string {
    return (
      name
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '') +
      '-' +
      Math.random().toString(36).substring(2, 7)
    );
  }
}
