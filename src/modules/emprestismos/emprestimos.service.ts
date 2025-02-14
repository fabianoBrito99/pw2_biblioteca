import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Emprestimos } from '../../entities/emprestimos.entity';
import { Livro } from '../../entities/livro.entity';

@Injectable()
export class EmprestimosService {
  private emprestimosRepository;
  private livroRepository;

  constructor(private dataSource: DataSource) {
    this.emprestimosRepository = this.dataSource.getRepository(Emprestimos);
    this.livroRepository = this.dataSource.getRepository(Livro);
  }

  /** Lista todos os empréstimos */
  async findAll(): Promise<Emprestimos[]> {
    return await this.emprestimosRepository.find({ relations: ['livro'] });
  }

  /** Busca um empréstimo específico */
  async findOne(id: number): Promise<Emprestimos> {
    return await this.emprestimosRepository.findOne({
      where: { id_emprestimo: id },
      relations: ['livro'],
    });
  }

  /** Cria um novo empréstimo */
  async create(data: Partial<Emprestimos>): Promise<Emprestimos> {
    const novoEmprestimo = this.emprestimosRepository.create(data);
    return await this.emprestimosRepository.save(novoEmprestimo);
  }

  /** Processa a devolução de um livro */
  async devolverLivro(id: number): Promise<void> {
    const emprestimo = await this.emprestimosRepository.findOne({
      where: { id_emprestimo: id },
      relations: ['livro'],
    });

    if (!emprestimo || emprestimo.data_devolucao) {
      throw new Error('Empréstimo inválido ou já devolvido');
    }

    emprestimo.data_devolucao = new Date();
    await this.emprestimosRepository.save(emprestimo);

    // Atualizar estoque do livro
    if (emprestimo.livro) {
      emprestimo.livro.quantidade_estoque += 1;
      await this.livroRepository.save(emprestimo.livro);
    }
  }
}
