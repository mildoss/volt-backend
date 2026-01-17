import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import {Product} from "@prisma/client";
import {AuthGuard} from "@nestjs/passport";
import {OnlyAdminGuard} from "../auth/guards/admin.guard";
import {GetAllProductDto} from "./dto/get-all-product.dto";

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthGuard('jwt'), OnlyAdminGuard)
  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @UseGuards(AuthGuard('jwt'), OnlyAdminGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.productsService.delete(+id);
  }

  @Get()
  async findAll(@Query() queryDto: GetAllProductDto) {
    return this.productsService.findAll(queryDto);
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string): Promise<Product> {
    return this.productsService.findOne(slug);
  }
}
