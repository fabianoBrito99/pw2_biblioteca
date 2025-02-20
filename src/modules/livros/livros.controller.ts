import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Render,
  UseGuards,
  Request,
  Res,
  Delete,
} from '@nestjs/common';
import { Response } from 'express';
import { LivrosService } from './livros.service';
import { CategoriaService } from '../categoria/categoria.service';
import { EstoqueService } from '../estoque/estoque.service';
import { AuthenticatedGuard } from '../../common/guards/authenticated.guard';
import { AutorService } from '../autor/autor.service';
import { EmprestimosService } from '../emprestimos/emprestimos.service';

@Controller('livros')
@UseGuards(AuthenticatedGuard)
export class LivrosController {
  constructor(
    private readonly livrosService: LivrosService,
    private readonly categoriaService: CategoriaService,
    private readonly autorService: AutorService,
    private readonly emprestimosService: EmprestimosService,
    private readonly estoqueService: EstoqueService,
  ) {}

  /** Página para editar livro */
  @Get('editar/:id')
@Render('livros/novo')
async editarLivro(@Param('id') id: number, @Request() req) {
  try {
    const livro = await this.livrosService.findOneDetalhado(id);

    // 🔹 Certifique-se de que a categoria e o autor sejam strings e não objetos
    const categoria = livro.categorias && livro.categorias.length > 0 ? livro.categorias[0].nome_categoria : '';
    const autor = livro.autores && livro.autores.length > 0 ? livro.autores[0].nome : '';

    return { 
      livro: { ...livro, categoria, autor } // Garante que os valores corretos sejam passados
    };
  } catch (error) {
    req.flash('errorMessage', 'Erro ao carregar livro para edição.');
    return { livro: null };
  }
}


  /** Página para criar novo livro */
  @Get('novo')
  @Render('livros/novo')
  novoLivro(@Request() req) {
    return {
      message: req.flash('message'),
      errorMessage: req.flash('errorMessage'),
    };
  }

  /** Listar todos os livros */
/** Listar todos os livros */
@Get()
async listarLivros(@Request() req, @Res() res: Response) {
  console.log('🔹 Usuário na sessão:', req.user);

  if (!req.user) {
    return res.status(403).json({ message: 'Usuário não autenticado' });
  }

  try {
    const livros = await this.livrosService.findAll();
    return res.render('livros/index', { livros, user: req.user });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao carregar livros' });
  }
}


  /** Criar ou atualizar livro */
  @Post()
  async criarOuAtualizarLivro(
    @Res() res: Response,
    @Body() livroData: any,
    @Request() req,
  ) {
    try {
      const { id_livro, categoria, autor, quantidade_estoque, ...dadosLivro } =
        livroData;

      // 🔹 Criar ou buscar categoria e autor
      const categoriaEntity =
        await this.categoriaService.findOrCreate(categoria);
      const autorEntity = await this.autorService.create(autor);

      let livro;
      if (id_livro) {
        livro = await this.livrosService.update(
          id_livro,
          dadosLivro,
          categoriaEntity,
          autorEntity,
        );
        req.flash('message', '📚 Livro atualizado com sucesso!');
      } else {
        livro = await this.livrosService.create(
          dadosLivro,
          quantidade_estoque,
          categoriaEntity,
          autorEntity,
        );
        req.flash('message', '📚 Livro cadastrado com sucesso!');
      }

      return res.redirect('/livros');
    } catch (error) {
      req.flash('errorMessage', 'Erro ao salvar o livro.');
      return res.redirect('/livros/novo');
    }
  }

  /** Página de detalhes do livro */
  @Get(':id')
  @Render('livros/detalhes')
  async verLivro(@Param('id') id: number, @Request() req) {
    try {
      const livro = await this.livrosService.findOneDetalhado(id);

      if (!livro) {
        return { erro: 'Livro não encontrado', hideMenu: false };
      }

      const estoque = await this.estoqueService.findOne(livro.id_livro);
      const quantidade_estoque = estoque?.quantidade_estoque || 0;

      return {
        livro,
        quantidade_estoque,
        podeReservar: quantidade_estoque > 0,
        success: req.flash('success')[0] || null,
        error: req.flash('error')[0] || null,
      };
    } catch (error) {
      return { erro: 'Erro ao carregar livro.', hideMenu: false };
    }
  }

  /** Rota para deletar um livro */
  @Post('deletar/:id')
  async deletarLivro(
    @Param('id') id: number,
    @Res() res: Response,
    @Request() req,
  ) {
    try {
      await this.livrosService.delete(id);
      req.flash('message', '📚 Livro excluído com sucesso!');
    } catch (error) {
      req.flash('errorMessage', 'Erro ao excluir o livro.');
    }
    return res.redirect('/livros');
  }

  /** Reservar um livro */
  @Post(':id/reservar')
  async reservarLivro(
    @Request() req,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    try {
      await this.emprestimosService.reservar(id);
      req.flash('success', 'Livro reservado com sucesso!');
    } catch (error) {
      req.flash('error', 'Erro ao reservar o livro.');
    }

    return res.redirect(`/livros/${id}`);
  }
}
