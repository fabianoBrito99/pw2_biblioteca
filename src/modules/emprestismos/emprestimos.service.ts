import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Emprestimos } from '../../entities/emprestismos.entity';

@Injectable()
export class EmprestimosService {
  constructor(
    @InjectRepository(Emprestimos)
    private emprestimosRepository: Repository<Emprestimos>,
  ) {}

  async findAll(): Promise<Emprestimos[]> {
    return this.emprestimosRepository.find({ relations: ['livro'] });
  }

  async findOne(id: number): Promise<Emprestimos> {
    return this.emprestimosRepository.findOne({ where: { id_emprestimo: id }, relations: ['livro'] });
  }

  async create(data: Partial<Emprestimos>): Promise<Emprestimos> {
    const emprestimo = this.emprestimosRepository.create(data);
    return this.emprestimosRepository.save(emprestimo);
  }

  async update(id: number, data: Partial<Emprestimos>): Promise<Emprestimos> {
    await this.emprestimosRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.emprestimosRepository.delete(id);
  }
}
