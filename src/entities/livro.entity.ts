import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Emprestimos } from './emprestismos.entity';
import { LivroCategoria } from './livro_categoria.entity';
import { Estoque } from './estoque.entity';


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

  @OneToMany(() => LivroCategoria, (livroCategoria) => livroCategoria.livro)
  categorias: LivroCategoria[];

  @OneToMany(() => Estoque, estoque => estoque.livro)
  estoques: Estoque[];
}
