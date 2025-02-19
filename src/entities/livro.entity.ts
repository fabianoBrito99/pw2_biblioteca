import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToOne,
} from 'typeorm';
import { Emprestimos } from './emprestimos.entity';
import { LivroCategoria } from './livro_categoria.entity';
import { Estoque } from './estoque.entity';
import { Categoria } from './categoria.entity';
import { Autor } from './autor.entity';

@Entity('livro')
export class Livro {
  @PrimaryGeneratedColumn()
  id_livro: number;

  @Column({ length: 100 })
  nome_livro: string;

  @Column({ nullable: true })
  quantidade_paginas?: number;

  @Column({ type: 'text', nullable: true })
  descricao?: string;

  @Column({ type: 'year', nullable: true })
  ano_publicacao?: number;

  @OneToMany(() => Emprestimos, (emprestimo) => emprestimo.livro)
  emprestimos: Emprestimos[];

  @ManyToMany(() => Categoria, (categoria) => categoria.livroCategorias, { eager: true }) 
  @JoinTable({
    name: 'livro_categoria',
    joinColumn: { name: 'fk_id_livros', referencedColumnName: 'id_livro' },
    inverseJoinColumn: { name: 'fk_id_categoria', referencedColumnName: 'id_categoria' }
  })
  categorias: Categoria[];

  @ManyToMany(() => Autor, (autor) => autor.livros)
  @JoinTable({
    name: 'autor_livro',
    joinColumn: { name: 'fk_id_livro', referencedColumnName: 'id_livro' },
    inverseJoinColumn: { name: 'fk_id_autor', referencedColumnName: 'id_autor' },
  })
  autores: Autor[];

  @OneToOne(() => Estoque, (estoque) => estoque.livro, { cascade: true })
  estoque: Estoque;

}
