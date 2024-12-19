import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Render,
} from '@nestjs/common';
import { EmprestimosService } from './emprestimos.service';
import { Emprestimos } from '../../entities/emprestismos.entity';

@Controller('emprestimos')
export class EmprestimosController {
  constructor(private readonly emprestimosService: EmprestimosService) {}

  @Get()
  @Render('emprestimos/index')
  async listarEmprestimos() {
    const emprestimos = await this.emprestimosService.findAll();
    return { emprestimos };
  }

  @Get('novo')
  @Render('emprestimos/novo')
  novoEmprestimo() {
    return {};
  }

  @Post()
  async criarEmprestimo(@Body() data: Partial<Emprestimos>) {
    return this.emprestimosService.create(data);
  }

  @Get(':id')
  @Render('emprestimos/detalhes')
  async verEmprestimo(@Param('id') id: number) {
    const emprestimo = await this.emprestimosService.findOne(id);
    return { emprestimo };
  }

  @Patch(':id')
  async atualizarEmprestimo(
    @Param('id') id: number,
    @Body() data: Partial<Emprestimos>,
  ) {
    return this.emprestimosService.update(id, data);
  }

  @Delete(':id')
  async removerEmprestimo(@Param('id') id: number) {
    return this.emprestimosService.remove(id);
  }
}
