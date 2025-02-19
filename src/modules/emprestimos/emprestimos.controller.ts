import { Controller, Get, Post, Patch, Param, Render, Request, Response } from '@nestjs/common';
import { EmprestimosService } from './emprestimos.service';

@Controller('emprestimos')
export class EmprestimosController {
  constructor(private readonly emprestimosService: EmprestimosService) {}

  @Get()
  @Render('emprestimo/index') // Certifique-se de que o caminho correto do arquivo está sendo passado
  async listarEmprestimos(@Request() req) {
    const emprestimos = await this.emprestimosService.listarEmprestimos();
  
    return {
      emprestimos,
      message: req.flash('message'),
      errorMessage: req.flash('errorMessage'),
    };
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

  @Post(':id_emprestimo/devolver')
  async devolverLivro(
    @Param('id_emprestimo') idEmprestimo: number,
    @Request() req,
    @Response() res
  ) {
    try {
      console.log(`[INFO] Iniciando devolução do empréstimo ID ${idEmprestimo}`);
      await this.emprestimosService.devolver(idEmprestimo);
      req.flash('message', 'Livro devolvido com sucesso!');
    } catch (error) {
      console.error(`[ERRO] Falha ao devolver livro ID ${idEmprestimo}: ${error.message}`);
      req.flash('errorMessage', 'Erro ao devolver o livro.');
    }

    return res.redirect('/emprestimos');
  }
}
