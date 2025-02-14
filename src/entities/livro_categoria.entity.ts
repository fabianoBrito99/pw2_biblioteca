import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Livro } from './livro.entity';
import { Categoria } from './categoria.entity';

@Entity('livro_categoria')
export class LivroCategoria {
  @PrimaryGeneratedColumn()
  id_livro_categoria: number;

  @ManyToOne(() => Livro, (livro) => livro.categorias, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_id_livros' })
  livro: Livro;

  @ManyToOne(() => Categoria, (categoria) => categoria.livroCategorias, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_id_categoria' })
  categoria: Categoria;
}
