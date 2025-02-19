import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Categoria } from '../../entities/categoria.entity';

@Injectable()
export class CategoriaService {
  private categoriaRepository;

  constructor(private dataSource: DataSource) {
    this.categoriaRepository = this.dataSource.getRepository(Categoria);
  }

  /** Retorna todas as categorias */
  async findAll(): Promise<Categoria[]> {
    return await this.categoriaRepository.find();
  }

  /** Retorna uma categoria específica */
  async findOne(id: number): Promise<Categoria> {
    return await this.categoriaRepository.findOne({ where: { id_categoria: id } });
  }

  /** Cria ou retorna uma categoria existente */
  async findOrCreate(nome_categoria: string): Promise<Categoria> {
    let categoria = await this.categoriaRepository.findOne({ where: { nome_categoria } });

    if (!categoria) {
      categoria = this.categoriaRepository.create({ nome_categoria });
      await this.categoriaRepository.save(categoria);
      console.log('[Service] Categoria criada:', categoria);
    } else {
      console.log('[Service] Categoria já existente:', categoria);
    }

    return categoria;
}

}
