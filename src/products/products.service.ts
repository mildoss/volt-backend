import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateProductDto} from './dto/create-product.dto';
import {PrismaService} from "../prisma.service";
import {EnumProductSort, GetAllProductDto} from "./dto/get-all-product.dto";
import {Prisma} from "@prisma/client";

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
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
      },
    });
  }

  async delete(id: number) {
    return this.prisma.product.delete({ where: { id } });
  }

  async findAll(dto: GetAllProductDto) {
    const { sort, searchTerm } = dto;

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

    const products = await this.prisma.product.findMany({
      where: prismaSearch,
      orderBy: prismaSort,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        imageUrl: true,
        stock: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return products;
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
