import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateProductDto} from './dto/create-product.dto';
import {PrismaService} from "../prisma.service";

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const {name, description, price, imageUrl, categoryId} = createProductDto;
    return this.prisma.product.create({
      data: {
        name,
        description,
        price,
        imageUrl,
        categoryId,
        slug: this.generateSlug(name)
      }
    });
  }

  async findAll(searchTerm?: string) {
    return this.prisma.product.findMany({
      where: searchTerm ? {
        OR: [
          {
            name: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          },
          {
            description: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          }
        ]
      } : {},
      include: {category: true}
    })
  }

  async findOne(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: {slug},
      include: {category: true}
    })

    if (!product) throw new NotFoundException('No product was found matching your search query.')

    return product;
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '') + '-' + Math.random().toString(36).substring(2, 7);
  }
}
