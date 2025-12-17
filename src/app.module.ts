import { Module } from '@nestjs/common';
import {PrismaService} from "./prisma.service";
import { ProductsModule } from './products/products.module';
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProductsModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
