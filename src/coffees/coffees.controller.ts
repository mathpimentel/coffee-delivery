import { Controller, Get, Post, Body, Param, HttpStatus, HttpCode, Query, Patch, Delete } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  @Get()
  async findAll() {
    return this.coffeesService.findAll();
  }

  @Get('search')
  async search(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('name') name?: string,
    @Query('tags') tags?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ) {
    const tagsList = tags ? tags.split(',') : [];
    
    return this.coffeesService.searchCoffees({
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,  
      name,
      tags: tagsList,
      limit: +limit,
      page: +page
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.coffeesService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffeesService.create(createCoffeeDto);
  }

  // adicionar outro endpoints
  @Patch(':id')
  async update(@Param('id') id:string, @Body() updateCoffeeDto: UpdateCoffeeDto){
    return this.coffeesService.update(id, updateCoffeeDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id:string){
    return this.coffeesService.remove(id)
  }
} 