import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Estoque } from '../../entities/estoque.entity';
import { Livro } from 'src/entities/livro.entity';

@Injectable()
export class EstoqueService {
  private estoqueRepository;

  constructor(private dataSource: DataSource) {
    this.estoqueRepository = this.dataSource.getRepository(Estoque);
  }

  /** Retorna todos os registros de estoque */
  async findAll(): Promise<Estoque[]> {
    return await this.estoqueRepository.find({ relations: ['livro'] });
  }

  /** Retorna um registro de estoque específico */
  async findOne(id: number): Promise<Estoque> {
    return await this.estoqueRepository.findOne({
      where: { id_estoque: id },
      relations: ['livro'],
    });
  }

  /** Atualiza a quantidade em estoque de um livro */
  async updateQuantidade(id: number, quantidade: number): Promise<Estoque> {
    const estoque = await this.estoqueRepository.findOne({
      where: { id_estoque: id },
    });

    if (!estoque) {
      throw new Error('Estoque não encontrado');
    }

    estoque.quantidade_estoque = quantidade;
    return await this.estoqueRepository.save(estoque);
  }

  /** Cria um novo registro de estoque */
  async create(livro: Livro, quantidade: number): Promise<Estoque> {
    console.log('🔹 [Service] Criando estoque para livro:', livro.nome_livro);

    const novoEstoque = new Estoque();
    novoEstoque.livro = livro; 
    novoEstoque.quantidade_estoque = quantidade;

    const estoqueSalvo = await this.estoqueRepository.save(novoEstoque);
    console.log('✅ [Service] Estoque salvo:', estoqueSalvo);

    return estoqueSalvo;
  }
}
