import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { EmprestimosService } from './emprestimos.service';
import { Emprestimos } from '../../entities/emprestimos.entity';

@Controller('emprestimos')
export class EmprestimosController {
  constructor(private readonly emprestimosService: EmprestimosService) {}

  @Get()
  async listarEmprestimos(): Promise<Emprestimos[]> {
    return this.emprestimosService.findAll();
  }

  @Get(':id')
  async verEmprestimo(@Param('id') id: number): Promise<Emprestimos> {
    return this.emprestimosService.findOne(id);
  }

  @Post()
  async criarEmprestimo(@Body() data: Partial<Emprestimos>): Promise<Emprestimos> {
    return this.emprestimosService.create(data);
  }

  @Patch(':id/devolver')
  async devolverLivro(@Param('id') id: number): Promise<void> {
    return this.emprestimosService.devolverLivro(id);
  }
}
