import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { Categoria } from '../../entities/categoria.entity';

@Controller('categorias')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  @Get()
  async findAll(): Promise<Categoria[]> {
    return this.categoriaService.findAll();
  }

  @Post()
  async create(@Body() categoria: Categoria): Promise<Categoria> {
    return this.categoriaService.create(categoria);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Categoria> {
    return this.categoriaService.findOne(id);
  }
}
