import { IsNumber, IsObject, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsNumber()
  categoryId: number;

  @IsNumber()
  stock: number;

  @IsOptional()
  @IsObject()
  specs?: Record<string, string>;
}
