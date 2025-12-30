import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export class AddToCartDto {
  @IsNumber()
  productId: number;

  @IsOptional()
  @IsNumber()
  quantity?: number;
}

export class UpdateCountDto {
  @IsEnum(['plus', 'minus'])
  type: 'plus' | 'minus';
}
