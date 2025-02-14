import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AutorService } from './autor.service';
import { Autor } from '../../entities/autor.entity';

@Controller('autores')
export class AutorController {
  constructor(private readonly autorService: AutorService) {}

  @Get()
  async listarAutores(): Promise<Autor[]> {
    return this.autorService.findAll();
  }

  @Get(':id')
  async verAutor(@Param('id') id: number): Promise<Autor> {
    return this.autorService.findOne(id);
  }

  @Post()
  async criarAutor(@Body('nome') nome: string): Promise<Autor> {
    return this.autorService.create(nome);
  }
}
