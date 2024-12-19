import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { EstoqueService } from './estoque.service';
import { Estoque } from '../../entities/estoque.entity';

@Controller('estoque')
export class EstoqueController {
  constructor(private readonly estoqueService: EstoqueService) {}

  @Get()
  async findAll(): Promise<Estoque[]> {
    return this.estoqueService.findAll();
  }

  @Post()
  async create(@Body() estoque: Estoque): Promise<Estoque> {
    return this.estoqueService.create(estoque);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Estoque> {
    return this.estoqueService.findOne(id);
  }
}
