import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Livro } from '../../entities/livro.entity';
import { Categoria } from '../../entities/categoria.entity';
import { Autor } from '../../entities/autor.entity';
import { EstoqueService } from '../estoque/estoque.service';

@Injectable()
export class LivrosService {
  private livroRepository;

  constructor(
    private dataSource: DataSource,
    private readonly estoqueService: EstoqueService
  ) {
    this.livroRepository = this.dataSource.getRepository(Livro);
  }

  /** Retorna todos os livros com categorias e autores */
  async findAll(): Promise<Livro[]> {
    try {
      console.log('🔹 [Service] Buscando todos os livros...');
      const livros = await this.livroRepository.find({
        relations: ['categorias', 'autores'],
      });

      // 🔹 Buscar quantidade_estoque da tabela Estoque
      for (const livro of livros) {
        const estoque = await this.estoqueService.findOne(livro.id_livro);
        livro['quantidade_estoque'] = estoque?.quantidade_estoque || 0;
      }

      return livros;
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
      throw new Error('Erro ao buscar livros.');
    }
  }

  /** Retorna detalhes de um livro */
  async findOneDetalhado(id: number): Promise<Livro> {
    try {
      const livro = await this.livroRepository.findOne({
        where: { id_livro: id },
        relations: ['categorias', 'autores'],
      });

      if (!livro) {
        throw new Error('Livro não encontrado.');
      }

      // 🔹 Buscar quantidade em estoque
      const estoque = await this.estoqueService.findOne(id);
      livro['quantidade_estoque'] = estoque?.quantidade_estoque || 0;

      return livro;
    } catch (error) {
      console.error('Erro ao buscar detalhes do livro:', error);
      throw new Error('Erro ao buscar livro.');
    }
  }

  /** Criar um novo livro */
  async create(
    livroData: Partial<Livro>,
    quantidade_estoque: number,
    categoria: Categoria,
    autor: Autor
  ): Promise<Livro> {
    console.log('🔹 [Service] Criando novo livro:', livroData);

    const novoLivro = this.livroRepository.create({
      ...livroData,
      categorias: [categoria],
      autores: [autor],
    });

    const livroSalvo = await this.livroRepository.save(novoLivro);

    // 🔹 Criar estoque associado ao livro
    if (quantidade_estoque !== undefined) {
      await this.estoqueService.create(livroSalvo, quantidade_estoque);
    }

    console.log('[Service] Livro criado com sucesso:', livroSalvo);
    return livroSalvo;
  }
}
