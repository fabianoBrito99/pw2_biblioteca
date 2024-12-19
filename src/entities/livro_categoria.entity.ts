import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Livro } from './livro.entity';
import { Categoria } from './categoria.entity';

@Entity('livro_categoria')
export class LivroCategoria {
  @PrimaryGeneratedColumn()
  id_livro_categoria: number;

  @ManyToOne(() => Livro, (livro) => livro.categorias, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_id_livros' }) // Mapeando a coluna `fk_id_livros` explicitamente
  livro: Livro;

  @ManyToOne(() => Categoria, (categoria) => categoria.livros, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_id_categoria' }) // Mapeando a coluna `fk_id_categoria` explicitamente
  categoria: Categoria;
}
