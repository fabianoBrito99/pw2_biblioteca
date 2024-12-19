import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Livro } from '../../entities/livro.entity';
import { LivroCategoria } from '../../entities/livro_categoria.entity'; // Importe correto
import { Categoria } from '../../entities/categoria.entity'; // Importe correto
import { EstoqueService } from '../estoque/estoque.service';

@Injectable()
export class LivrosService {
  constructor(
    @InjectRepository(Livro) private livroRepository: Repository<Livro>,
    private readonly estoqueService: EstoqueService,
    @InjectRepository(LivroCategoria)
    private livroCategoriaRepository: Repository<LivroCategoria>,
  ) {}

  // Retorna todos os livros com suas categorias relacionadas
  async findAll(): Promise<Livro[]> {
    return await this.livroRepository.find({ relations: ['categorias'] });
  }

  // Retorna um livro específico com suas categorias relacionadas
  async findOne(id: number): Promise<Livro> {
    return await this.livroRepository.findOne({
      where: { id_livro: id },
      relations: ['categorias'],
    });
  }

  // Cria um novo livro
  async create(
    livroData: Partial<Livro>,
    quantidade_estoque: number,
  ): Promise<Livro> {
    const novoLivro = this.livroRepository.create(livroData);

    // Salva o livro
    const livroSalvo = await this.livroRepository.save(novoLivro);

    // Cria o estoque associado ao livro
    if (quantidade_estoque >= 0) {
      await this.estoqueService.create({
        quantidade_estoque,
        livro: livroSalvo, // Associando o estoque ao livro
      });
    }

    return livroSalvo;
  }

  // Atualiza um livro existente
  async update(id: number, livroData: Partial<Livro>): Promise<Livro> {
    await this.livroRepository.update(id, livroData);
    return this.findOne(id);
  }

  // Remove um livro pelo ID
  async remove(id: number): Promise<void> {
    await this.livroRepository.delete(id);
  }

  // Associa uma categoria a um livro
  async associarCategoria(livro: Livro, categoria: Categoria): Promise<void> {
    if (!livro || !categoria) {
      throw new Error('Livro ou Categoria não encontrados');
    }

    const livroCategoria = this.livroCategoriaRepository.create({
      livro,
      categoria,
    });
    await this.livroCategoriaRepository.save(livroCategoria);
  }
}
