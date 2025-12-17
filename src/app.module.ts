import { Module } from '@nestjs/common';
import {PrismaService} from "./prisma.service";
import { ProductsModule } from './products/products.module';
import {ConfigModule} from "@nestjs/config";
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProductsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
