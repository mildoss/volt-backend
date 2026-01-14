import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../prisma.service";
import {UpdateUserDto} from "./dto/update-user.dto";
import {compare, hash} from "bcrypt";


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
        phone: true,
        avatarUrl: true,
        address: true,
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

  async updateProfile(id: number, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.email) {
      const isSameUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
      if (isSameUser && id !== isSameUser.id) {
        throw new BadRequestException('Email is already busy');
      }
    }

    let newPassword = user.password;
    if (dto.password) {
      if (!dto.oldPassword) {
        throw new BadRequestException('To change password, enter your old password');
      }

      const isValidOldPassword = await compare(dto.oldPassword, user.password);
      if (!isValidOldPassword) {
        throw new BadRequestException('Invalid old password');
      }

      newPassword = await hash(dto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        email: dto.email,
        fullName: dto.fullName,
        avatarUrl: dto.avatarUrl,
        phone: dto.phone,
        address: dto.address,
        password: newPassword,
      },
    });
  }
}
