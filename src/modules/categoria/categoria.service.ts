import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from '../../entities/categoria.entity';

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  async findAll(): Promise<Categoria[]> {
    return this.categoriaRepository.find();
  }

  async create(categoria: Categoria): Promise<Categoria> {
    const newCategoria = this.categoriaRepository.create(categoria);
    return this.categoriaRepository.save(newCategoria);
  }

  async findOne(id: number): Promise<Categoria> {
    return this.categoriaRepository.findOneBy({ id_categoria: id });
  }
  async findOrCreate(nome_categoria: string): Promise<Categoria> {
    let categoria = await this.categoriaRepository.findOne({ where: { nome_categoria } });
    if (!categoria) {
      categoria = this.categoriaRepository.create({ nome_categoria });
      categoria = await this.categoriaRepository.save(categoria);
    }
    return categoria;
  }
  
}
