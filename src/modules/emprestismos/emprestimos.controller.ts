import { Controller, Get, Post, Patch, Param } from '@nestjs/common';
import { EmprestimosService } from './emprestimos.service';

@Controller('emprestimos')
export class EmprestimosController {
  constructor(private readonly emprestimosService: EmprestimosService) {}

  @Get()
  async listarEmprestimos() {
    return this.emprestimosService.listarEmprestimos();
  }

  @Post(':id_livro/reservar')
  async reservarLivro(@Param('id_livro') idLivro: number) {
    try {
      console.log(`[INFO] Iniciando reserva do livro ID ${idLivro}`);
      const emprestimo = await this.emprestimosService.reservar(idLivro);
      return { success: 'Livro reservado com sucesso!', emprestimo };
    } catch (error) {
      console.error(`[ERRO] Falha ao reservar livro ID ${idLivro}: ${error.message}`);
      return { error: 'Erro ao reservar o livro.' };
    }
  }

  @Patch(':id_emprestimo/devolver')
  async devolverLivro(@Param('id_emprestimo') idEmprestimo: number) {
    try {
      console.log(`[INFO] Iniciando devolução do empréstimo ID ${idEmprestimo}`);
      const emprestimo = await this.emprestimosService.devolver(idEmprestimo);
      return { success: 'Livro devolvido com sucesso!', emprestimo };
    } catch (error) {
      console.error(`[ERRO] Falha ao devolver livro ID ${idEmprestimo}: ${error.message}`);
      return { error: 'Erro ao devolver o livro.' };
    }
  }
}
