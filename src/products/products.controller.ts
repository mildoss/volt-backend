import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Delete,
  Patch,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { OnlyAdminGuard } from '../auth/guards/admin.guard';
import { GetAllProductDto } from './dto/get-all-product.dto';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { PaginationDto } from '../pagination/dto/pagination.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthGuard('jwt'), OnlyAdminGuard)
  @Post()
  async create(
    @CurrentUser('id') userId: number,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productsService.create(userId, createProductDto);
  }

  @UseGuards(AuthGuard('jwt'), OnlyAdminGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.productsService.delete(+id);
  }

  @UseGuards(AuthGuard('jwt'), OnlyAdminGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: CreateProductDto) {
    return this.productsService.update(+id, dto);
  }

  @Get('admin/all')
  @UseGuards(AuthGuard('jwt'), OnlyAdminGuard)
  async findAllForAdmin(@Query() dto: PaginationDto) {
    return this.productsService.findAllForAdmin(dto);
  }

  @Get()
  async findAll(@Query() queryDto: GetAllProductDto) {
    return this.productsService.findAll(queryDto);
  }

  @Get('by-id/:id')
  async findById(@Param('id') id: string) {
    return this.productsService.findById(+id);
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string): Promise<Product> {
    return this.productsService.findOne(slug);
  }
}
