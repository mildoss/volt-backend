import {BadRequestException, Injectable} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import {PrismaService} from "../prisma.service";
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async placeOrder(userId: number, dto: CreateOrderDto) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const total = cart.items.reduce((acc, item) => {
      return acc + item.product.price * item.quantity;
    }, 0);

    const result = await this.prisma.$transaction(async (prisma) => {
      const order = await prisma.order.create({
        data: {
          userId,
          status: 'PENDING',
          total,
          address: dto.address,
          phone: dto.phone,
          comment: dto.comment,
        },
      });

      for (const item of cart.items) {
        if (item.product.stock < item.quantity) {
          throw new BadRequestException(
            `Not enough stock for product: ${item.product.name}`,
          );
        }

        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          },
        });

        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
          },
        });

        await prisma.cartItem.deleteMany({
          where: { cartId: cart.id },
        });
      }
      return order;
    });

    return result;
  }

  async getMyOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  }

  async getAll() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            avatarUrl: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });
  }

  async updateStatus(orderId: number, status: OrderStatus) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new BadRequestException('Order not found');

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }
}
