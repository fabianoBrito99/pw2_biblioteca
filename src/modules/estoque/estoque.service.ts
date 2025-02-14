import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Estoque } from '../../entities/estoque.entity';

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
  async create(quantidade_estoque: number): Promise<Estoque> {
    const novoEstoque = this.estoqueRepository.create({ quantidade_estoque });
    return await this.estoqueRepository.save(novoEstoque);
  }
}
