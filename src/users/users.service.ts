import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../prisma.service";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById (id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        favorites: {
          select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true,
            slug: true
          }
        }
      }
    })

    if (!user) throw new NotFoundException('User not found!');

    return user;
  }

  async toggleFavorite(userId: number, productId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { favorites: true },
    });

    if (!user) throw new NotFoundException('User not found');

    const isExists = user.favorites.some((product) => product.id === productId);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        favorites: {
          [isExists ? 'disconnect' : 'connect']: {
            id: productId
          }
        }
      }
    })

    return { message: isExists ? 'Removed from favorites' : 'Added to favorites' }
  }
}
