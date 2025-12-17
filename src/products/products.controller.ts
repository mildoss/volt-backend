import {Controller, Get, Post, Body, Param, Query} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import {Product} from "@prisma/client";

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Get()
  async findAll(@Query('searchTerm') searchTerm: string): Promise<Product[]> {
    return this.productsService.findAll(searchTerm);
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string): Promise<Product> {
    return this.productsService.findOne(slug)
  }
}
