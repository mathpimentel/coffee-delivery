import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';


@Injectable()
export class CoffeesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const coffees = await this.prisma.coffee.findMany({
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return coffees.map(coffee => ({
      ...coffee,
      tags: coffee.tags.map(coffeeTag => coffeeTag.tag),
    }));
  }

  async findOne(id: string) {
    const coffee = await this.prisma.coffee.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!coffee) {
      throw new NotFoundException(`Coffee with ID ${id} not found`);
    }

    return {
      ...coffee,
      tags: coffee.tags.map(coffeeTag => coffeeTag.tag),
    };
  }

  async create(createCoffeeDto: CreateCoffeeDto) {
    // código aqui
    const {tagIds, ...coffeeDto} = createCoffeeDto
    
    return this.prisma.coffee.create({data: {
      ...coffeeDto,
      tags : { create: tagIds.map(tagId => ({
        tag: { connect: {id: tagId}}
      }))}
    },
    include: { tags : { include : {tag:true}}}  
  });
  
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    // código de implementação aqui
    const {tagIds, ...coffeeDto} = updateCoffeeDto

    await this.findOne(id)

    if(tagIds){
      await this.prisma.coffeeTag.deleteMany({
        where: {coffeeId: id}
      })

      await Promise.all(
        tagIds.map( tagId => this.prisma.coffeeTag.create({
          data: {
            coffee: {connect: {id}},
            tag: {connect: {id: tagId}}
          }
        }))
      )
    }

    // Atualizar os dados do café
    return this.prisma.coffee.update({
      where: { id },
      data: coffeeDto, // seu dados atualziados iserir aqui
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    //  1 - Verificar se o café existe
    await this.findOne(id)

    // 2 - Remover o café
    await this.prisma.coffee.delete({where: {id}})
  }

  async searchCoffees(params: {
    startDate?: Date;
    endDate?: Date;
    minPrice? : number;
    maxPrice? : number;
    name?: string;
    tags?: string[];
    limit?: number;
    page?: number;
  }) {
    const { startDate, endDate, minPrice, maxPrice, name, tags, limit=10, page=1 } = params;


    // Construir o filtro
    const skip = (Math.max(1, page) - 1) * limit;

    const where: any = {}
  
    // Filtro por nome
    if(name){
      where.name = {
        contains: name,
        mode: 'insensitive'
      }
    }

    // Filtro por intervalo de preços
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) {
        where.price.gte = minPrice;
      }
      if (maxPrice) {
        where.price.lte = maxPrice;
      }
    }

    // Filtro por tags
    if(tags && tags.length > 0){
      where.tags = {
        some: { 
          tag: {
            name: { in: tags }
          }
        }
      }
    }

    // Filtro por data
    if(startDate || endDate){
      where.createAt = {}
      if(startDate){
        where.createdAt.gte = startDate
      }
      if(endDate){
        where.createdAt.lte = endDate
      }
    }

    // Buscar os cafés com paginação
    const [coffees, totalItems] = await Promise.all([
      this.prisma.coffee.findMany({
        where,
        include: {
          tags: { include : {tag: true}}
        },
        skip: skip,
        take: limit
      }),
      this.prisma.coffee.count({where: where})
    ])

    const formatedCoffees = coffees.map(coffee => ({
      ...coffee,
      tags: coffee.tags.map(coffeeTag => coffeeTag.tag)
    }))

    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = Math.max(1, page);

    // Informações sobre os filtros aplicados
    const appliedFilters = {
      name: name || null,
      minPrice: minPrice || null,
      maxPrice: maxPrice || null,
      tags: tags && tags.length > 0 ? tags : null,
      startDate: startDate ? startDate.toISOString().split('T')[0] : null,
      endDate: endDate ? endDate.toISOString().split('T')[0] : null,
    }; 

    // Formatar a resposta
    return {
      data: formatedCoffees,
      pagination: {
        totalItems,
        currentPage,
        totalPages,
        limit,
        hasMore: currentPage < totalPages,
      },
      filters: appliedFilters,
    };
    
  }
} 