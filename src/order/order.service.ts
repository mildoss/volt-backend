import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from '../prisma.service';
import { OrderStatus } from '@prisma/client';
import { PaginationService } from '../pagination/pagination.service';
import { PaginationDto } from '../pagination/dto/pagination.dto';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService,
  ) {}

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

  async getAll(dto: PaginationDto) {
    const { skip, perPage } = this.paginationService.getPagination(dto);

    const orders = await this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: perPage,
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                imageUrl: true,
                price: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            phone: true,
          },
        },
      },
    });

    const count = await this.prisma.order.count();

    return { items: orders, length: count };
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
