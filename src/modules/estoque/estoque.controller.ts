import { Controller, Get, Patch, Body, Param } from '@nestjs/common';
import { EstoqueService } from './estoque.service';
import { Estoque } from '../../entities/estoque.entity';

@Controller('estoque')
export class EstoqueController {
  constructor(private readonly estoqueService: EstoqueService) {}

  @Get()
  async listarEstoque(): Promise<Estoque[]> {
    return this.estoqueService.findAll();
  }

  @Get(':id')
  async verEstoque(@Param('id') id: number): Promise<Estoque> {
    return this.estoqueService.findOne(id);
  }

  @Patch(':id')
  async atualizarQuantidade(@Param('id') id: number, @Body('quantidade') quantidade: number): Promise<Estoque> {
    return this.estoqueService.updateQuantidade(id, quantidade);
  }
}
