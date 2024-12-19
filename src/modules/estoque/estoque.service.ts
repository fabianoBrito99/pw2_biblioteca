import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estoque } from '../../entities/estoque.entity';
import { Livro } from '../../entities/livro.entity'; // Importe a entidade Livro

@Injectable()
export class EstoqueService {
  constructor(
    @InjectRepository(Estoque)
    private readonly estoqueRepository: Repository<Estoque>,
  ) {}

  async findAll(): Promise<Estoque[]> {
    return this.estoqueRepository.find();
  }

  async create(estoqueData: { quantidade_estoque: number; livro: Livro }): Promise<Estoque> {
    if (estoqueData.quantidade_estoque === undefined || estoqueData.quantidade_estoque < 0) {
      throw new Error('Quantidade de estoque inválida');
    }

    if (!estoqueData.livro) {
      throw new Error('Livro não encontrado');
    }

    const novoEstoque = this.estoqueRepository.create(estoqueData);
    return this.estoqueRepository.save(novoEstoque);
  }

  async findOne(id: number): Promise<Estoque> {
    return this.estoqueRepository.findOneBy({ id_estoque: id });
  }
}
