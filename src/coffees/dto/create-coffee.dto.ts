import { IsArray, IsNotEmpty, IsNumber, IsString, IsUrl, MaxLength, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCoffeeDto {
  // não pode ser vazio
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  // mínimo de 10 e máximo de 200 caracteres
  @IsString()
  @MinLength(10)
  @MaxLength(200)
  description: string;

  // número positivo com até 2 casas decimais
  @Min(0.01)
  @IsNumber({maxDecimalPlaces:2})
  @Type(() => Number)
  price: number;

  // deve ser uma URL válida
  @IsUrl()
  imageUrl: string;

  @IsArray()
  @IsNotEmpty()
  tagIds: string[];
} 