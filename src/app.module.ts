import { Module } from '@nestjs/common';
import {PrismaService} from "./prisma.service";
import { ProductsModule } from './products/products.module';
import {ConfigModule} from "@nestjs/config";
import { AuthModule } from './auth/auth.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProductsModule,
    AuthModule,
    ReviewsModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
