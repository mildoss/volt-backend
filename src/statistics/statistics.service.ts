import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class StatisticsService {
  constructor(private prisma: PrismaService) {}

  async getMainStatistics() {
    const ordersCount = await this.prisma.order.count();
    const usersCount = await this.prisma.user.count();

    const totalRevenueAggregate = await this.prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        status: {
          in: ['DELIVERED', 'SHIPPED'],
        },
      },
    });

    return [
      {
        name: 'Total Revenue',
        value: totalRevenueAggregate._sum.total || 0,
        isMoney: true,
      },
      {
        name: 'Orders',
        value: ordersCount,
        isMoney: false,
      },
      {
        name: 'Users',
        value: usersCount,
        isMoney: false,
      },
    ];
  }
}
