import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { LivroCategoria } from './livro_categoria.entity';

@Entity('categoria')
export class Categoria {
  @PrimaryGeneratedColumn()
  id_categoria: number;

  @Column({ length: 100 })
  nome_categoria: string;

  @OneToMany(() => LivroCategoria, (livroCategoria) => livroCategoria.categoria)
  livroCategorias: LivroCategoria[];
  
  
}
