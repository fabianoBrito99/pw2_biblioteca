import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { Categoria } from '../../entities/categoria.entity';

@Controller('categorias')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  @Get()
  async listarCategorias(): Promise<Categoria[]> {
    return this.categoriaService.findAll();
  }

  @Get(':id')
  async verCategoria(@Param('id') id: number): Promise<Categoria> {
    return this.categoriaService.findOne(id);
  }

  @Post()
  async criarCategoria(@Body('nome_categoria') nome_categoria: string): Promise<Categoria> {
    return this.categoriaService.findOrCreate(nome_categoria);
  }
}
