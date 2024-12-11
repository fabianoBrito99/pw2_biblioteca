import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Livro } from '../../entities/livro.entity';

@Injectable()
export class LivrosService {
  constructor(
    @InjectRepository(Livro) private livroRepository: Repository<Livro>,
  ) {}

  async findAll(): Promise<Livro[]> {
    console.log('Buscando livros no banco...');
    const livros = await this.livroRepository.find();
    console.log('Livros encontrados:', livros);
    return livros;
  }
}
