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
import { AutorService } from '../autor/autor.service';

@Controller('livros')
@UseGuards(AuthenticatedGuard)
export class LivrosController {
  constructor(
    private readonly livrosService: LivrosService,
    private readonly categoriaService: CategoriaService,
    private readonly autorService: AutorService,
    private readonly estoqueService: EstoqueService,
  ) {}

  /** Lista todos os livros - Protegido por autenticação */
  @Get()
  async listarLivros(@Request() req, @Res() res: Response) {
    console.log('🔹 [Controller] Acessando /livros');
    console.log('🔹 [Controller] Sessão do usuário:', req.session?.user);

    if (!req.session?.user) {
      console.log(
        '⚠️ [Controller] Usuário não autenticado - Redirecionando para login',
      );
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

  /** Página para criar novo livro */
  @Get('novo')
  @Render('livros/novo')
  novoLivro(@Request() req) {
    return {
      message: req.flash('message'),
      errorMessage: req.flash('errorMessage'),
    };
  }

  /** Criar livro */
  /** Criar livro */
  @Post()
  async criarLivro(
    @Res() res: Response,
    @Body() livroData: any,
    @Request() req,
  ) {
    try {
      const { categoria, autor, quantidade_estoque, ...dadosLivro } = livroData;

      console.log('🔹 [Controller] Dados recebidos:', livroData);

      // 🔹 Criar ou buscar categoria
      const categoriaEntity =
        await this.categoriaService.findOrCreate(categoria);
      console.log('✅ [Controller] Categoria associada:', categoriaEntity);

      // 🔹 Criar ou buscar autor
      const autorEntity = await this.autorService.create(autor);
      console.log('✅ [Controller] Autor associado:', autorEntity);

      // 🔹 Criar o livro com as associações
      const livro = await this.livrosService.create(
        dadosLivro,
        quantidade_estoque,
        categoriaEntity,
        autorEntity,
      );
      console.log('✅ [Controller] Livro cadastrado com sucesso:', livro);

      // 🔹 Criar estoque associado ao livro
      if (quantidade_estoque !== undefined) {
        await this.estoqueService.create(livro, quantidade_estoque);
        console.log('✅ [Controller] Estoque salvo:', quantidade_estoque);
      }

      req.flash(
        'message',
        '📚 Livro cadastrado com sucesso, incluindo estoque!',
      );
      return res.redirect('/livros/novo');
    } catch (error) {
      console.error('❌ [Controller] Erro ao cadastrar livro:', error);
      req.flash('errorMessage', 'Erro ao cadastrar o livro.');
      return res.redirect('/livros/novo');
    }
  }

  /** Página de detalhes do livro */
  @Get(':id')
  @Render('livros/detalhes')
  async verLivro(@Param('id') id: number) {
    console.log(`🔹 [Controller] Buscando detalhes do livro ID: ${id}`);
    const livro = await this.livrosService.findOneDetalhado(id);

    if (!livro) {
      console.warn(`❌ [Controller] Livro ID ${id} não encontrado.`);
      return { erro: 'Livro não encontrado', hideMenu: false };
    }

    // 🔹 Buscar estoque
    const estoque = await this.estoqueService.findOne(livro.id_livro);
    const quantidade_estoque = estoque?.quantidade_estoque || 0;

    console.log(`✅ [Controller] Livro encontrado:`, livro);
    console.log(`✅ [Controller] Estoque encontrado: ${quantidade_estoque}`);

    return {
      livro,
      quantidade_estoque,
      hideMenu: false,
      podeReservar: quantidade_estoque > 0,
    };
  }

  /** Criar reserva do livro */
  /** Criar reserva do livro */
  @Post(':id/reservar')
  async reservarLivro(
    @Request() req,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    try {
      const codigoReserva = await this.livrosService.reservarLivro(
        id,
        req.session.user.id_usuario,
      );

      // Redireciona para a página do livro com mensagem de sucesso e código de reserva
      return res.redirect(
        `/livros/${id}?success=Livro reservado com sucesso! Código: ${codigoReserva}`,
      );
    } catch (error) {
      console.error('Erro ao reservar livro:', error);

      // Redireciona para a página do livro com mensagem de erro
      return res.redirect(`/livros/${id}?error=Erro ao reservar livro.`);
    }
  }
}
