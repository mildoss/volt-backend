import { IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  address: string;

  @IsString()
  phone: string;

  @IsString()
  @IsOptional()
  comment?: string;
}
