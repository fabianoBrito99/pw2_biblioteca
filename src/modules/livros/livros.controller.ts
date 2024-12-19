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
import { LivrosService } from './livros.service';
import { CategoriaService } from '../categoria/categoria.service';
import { EstoqueService } from '../estoque/estoque.service';
import { Livro } from '../../entities/livro.entity';

@Controller('livros')
export class LivrosController {
  constructor(
    private readonly livrosService: LivrosService,
    private readonly categoriaService: CategoriaService,
    private readonly estoqueService: EstoqueService,
  ) {}

  @Get()
  @Render('livros/index')
  async listarLivros() {
    const livros = await this.livrosService.findAll();
    return { livros };
  }

  @Get('novo')
  @Render('livros/novo')
  novoLivro() {
    return {};
  }

  @Post()
  @Post()
  async criarLivro(
    @Body() livroData: {
      nome_livro: string;
      quantidade_paginas: number;
      descricao: string;
      ano_publicacao: number;
      categoria: string;
      quantidade_estoque: number;
    },
  ) {
    try {
      const { categoria, quantidade_estoque, ...dadosLivro } = livroData;
  
      // Log para verificar o valor de quantidade_estoque
      console.log('Quantidade em estoque recebida:', quantidade_estoque);
  
      // Criando o livro e passando quantidade_estoque como segundo argumento
      const livro = await this.livrosService.create(dadosLivro, quantidade_estoque);
  
      // Associando a categoria se fornecida
      if (categoria) {
        const categoriaEntity = await this.categoriaService.findOrCreate(categoria);
        await this.livrosService.associarCategoria(livro, categoriaEntity);
      }
  
      // Criando o estoque se a quantidade_estoque for fornecida
      if (quantidade_estoque !== undefined) {
        console.log('Criando estoque com quantidade:', quantidade_estoque);
        await this.estoqueService.create({
          quantidade_estoque,
          livro: livro, // Garantir que estamos associando o estoque ao livro correto
        });
      }
  
      return livro;
    } catch (error) {
      console.error('Erro ao criar livro:', error);
      throw new Error('Erro ao criar livro');
    }
  }
  
  
  

  @Get(':id')
  @Render('livros/detalhes')
  async verLivro(@Param('id') id: number) {
    const livro = await this.livrosService.findOne(id);
    return { livro };
  }

  @Patch(':id')
  async atualizarLivro(
    @Param('id') id: number,
    @Body() livroData: Partial<Livro>,
  ) {
    return this.livrosService.update(id, livroData);
  }

  @Delete(':id')
  async removerLivro(@Param('id') id: number) {
    return this.livrosService.remove(id);
  }
}
