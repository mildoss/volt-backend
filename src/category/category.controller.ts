import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthGuard } from '@nestjs/passport';
import { OnlyAdminGuard } from '../auth/guards/admin.guard';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAll() {
    return this.categoryService.getAll();
  }

  @UseGuards(AuthGuard('jwt'), OnlyAdminGuard)
  @Post()
  async create(@Body() dto: { name: string }) {
    return this.categoryService.create(dto.name);
  }

  @UseGuards(AuthGuard('jwt'), OnlyAdminGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.categoryService.delete(+id);
  }
}
