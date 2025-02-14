import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Autor } from '../../entities/autor.entity';

@Injectable()
export class AutorService {
  private autorRepository;

  constructor(private dataSource: DataSource) {
    this.autorRepository = this.dataSource.getRepository(Autor);
  }

  /** Retorna todos os autores */
  async findAll(): Promise<Autor[]> {
    return await this.autorRepository.find({ relations: ['livros'] });
  }

  /** Retorna um autor específico */
  async findOne(id: number): Promise<Autor> {
    return await this.autorRepository.findOne({ where: { id_autor: id }, relations: ['livros'] });
  }

  /** Cria um novo autor */
  async create(nome: string): Promise<Autor> {
    let autor = await this.autorRepository.findOne({ where: { nome } });

    if (!autor) {
      autor = this.autorRepository.create({ nome });
      await this.autorRepository.save(autor);
    }

    return autor;
  }
}
