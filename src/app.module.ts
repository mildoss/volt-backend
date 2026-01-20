import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ProductsModule } from './products/products.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ReviewsModule } from './reviews/reviews.module';
import { UsersModule } from './users/users.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { MediaModule } from './media/media.module';
import { StatisticsModule } from './statistics/statistics.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProductsModule,
    AuthModule,
    ReviewsModule,
    UsersModule,
    CartModule,
    OrderModule,
    MediaModule,
    StatisticsModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
