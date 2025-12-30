import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AddToCartDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: number) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true,
                slug: true,
                stock: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: { items: { include: { product: true } } },
      });
    }

    return cart;
  }

  async addToCart(userId: number, dto: AddToCartDto) {
    const cart = await this.getCart(userId);

    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: dto.productId,
      },
    });

    if (existingItem) {
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + (dto.quantity || 1) },
      });
    } else {
      return this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: dto.productId,
          quantity: dto.quantity || 1,
        },
      });
    }
  }

  async updateCount(userId: number, itemId: number, type: 'plus' | 'minus') {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!item) throw new NotFoundException('Item not found');

    if (item.cart.userId !== userId) {
      throw new ForbiddenException('You cannot manage this cart');
    }

    if (type === 'plus') {
      return this.prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity: item.quantity + 1 },
      });
    } else {
      if (item.quantity === 1) {
        return this.prisma.cartItem.delete({ where: { id: itemId } });
      }
      return this.prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity: item.quantity - 1 },
      });
    }
  }

  async removeFromCart(userId: number, itemId: number) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!item) throw new NotFoundException('Item not found');

    if (item.cart.userId !== userId) {
      throw new ForbiddenException('You cannot manage this cart');
    }

    return this.prisma.cartItem.delete({
      where: { id: itemId },
    });
  }
}
