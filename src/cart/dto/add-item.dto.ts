import { IsNotEmpty, IsString, IsInt, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class AddItemDto {
  @IsNotEmpty()
  @IsString()
  coffeeId: string;

  @IsInt()
  @IsNumber({maxDecimalPlaces:2})  
  @Min(1)
  @Max(5)
  @Type(() => Number)
  quantity: number;
} 