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
  @Get()
  async listarLivros(@Request() req, @Res() res: Response) {
    if (!req.session?.user) {
      return res.redirect('/auth/login');
    }

    try {
      const livros = await this.livrosService.findAll();
      return res.render('livros/index', { livros, user: req.session.user });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao carregar livros' });
    }
  }

  /** Criar livro */
  @Post()
  async criarLivro(
    @Res() res: Response,
    @Body() livroData: any,
    @Request() req,
  ) {
    try {
      const { categoria, autor, quantidade_estoque, ...dadosLivro } = livroData;

      // 🔹 Criar ou buscar categoria
      const categoriaEntity =
        await this.categoriaService.findOrCreate(categoria);

      // 🔹 Criar ou buscar autor
      const autorEntity = await this.autorService.create(autor);

      // 🔹 Criar o livro com as associações
      const livro = await this.livrosService.create(
        dadosLivro,
        quantidade_estoque,
        categoriaEntity,
        autorEntity,
      );

      // 🔹 Criar estoque associado ao livro
      if (quantidade_estoque !== undefined) {
        await this.estoqueService.create(livro, quantidade_estoque);
      }

      req.flash(
        'message',
        '📚 Livro cadastrado com sucesso, incluindo estoque!',
      );
      return res.redirect('/livros/novo');
    } catch (error) {
      req.flash('errorMessage', 'Erro ao cadastrar o livro.');
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
