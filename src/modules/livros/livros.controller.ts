import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
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

@Controller('livros')
@UseGuards(AuthenticatedGuard) 
export class LivrosController {
  constructor(
    private readonly livrosService: LivrosService,
    private readonly categoriaService: CategoriaService,
    private readonly estoqueService: EstoqueService,
  ) {}

  /** Lista todos os livros - Protegido por autenticação */
  @Get()
  async listarLivros(@Request() req, @Res() res: Response) {
    console.log('🔹 [Controller] Acessando /livros');
    console.log('🔹 [Controller] Sessão do usuário:', req.session?.user);

    if (!req.session?.user) {
      console.log('⚠️ [Controller] Usuário não autenticado - Redirecionando para login');
      return res.redirect('/auth/login'); 
    }

    try {
      const livros = await this.livrosService.findAll();
      console.log('✅ [Controller] Livros encontrados:', livros);

      return res.render('livros/index', { livros, user: req.session.user });
    } catch (error) {
      console.error('❌ [Controller] Erro ao buscar livros:', error);
      return res.status(500).json({ error: 'Erro ao carregar livros' });
    }
  }

  /** Página para criar novo livro - Protegida */
  @Get('novo')
  @Render('livros/novo')
  novoLivro() {
    return { hideMenu: false };
  }

  /** Criar livro */
  @Post()
  async criarLivro(@Res() res: Response, @Body() livroData: any) {
    try {
      const { categoria, quantidade_estoque, autores, ...dadosLivro } = livroData;

      // Garantir que `autores` seja um array
      const listaAutores = Array.isArray(autores) ? autores : [autores];

      const livro = await this.livrosService.create(dadosLivro, quantidade_estoque, listaAutores);

      if (categoria) {
        const categoriaEntity = await this.categoriaService.findOrCreate(categoria);
        await this.livrosService.associarCategoria(livro, categoriaEntity);
      }

      if (quantidade_estoque !== undefined) {
        await this.estoqueService.create(quantidade_estoque); 
      }

      return res.redirect('/livros');
    } catch (error) {
      console.error('Erro ao criar livro:', error);
      return res.redirect('/livros/novo');
    }
  }

  /** Página de detalhes do livro */
  @Get(':id')
  @Render('livros/detalhes')
  async verLivro(@Param('id') id: number) {
    const livro = await this.livrosService.findOneDetalhado(id);

    return {
      livro,
      hideMenu: false,
      podeReservar: livro.quantidade_estoque > 0, // Só permite reserva se houver estoque
    };
  }

  /** Criar reserva do livro */
  @Post(':id/reservar')
  async reservarLivro(@Request() req, @Res() res: Response, @Param('id') id: number) {
    try {
      await this.livrosService.reservarLivro(id, req.session.user.id_usuario);
      return res.redirect(`/livros/${id}`);
    } catch (error) {
      console.error('Erro ao reservar livro:', error);
      return res.redirect(`/livros/${id}`);
    }
  }
}
