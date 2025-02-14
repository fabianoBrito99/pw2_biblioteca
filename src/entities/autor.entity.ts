import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Livro } from './livro.entity';

@Entity('autor')
export class Autor {
  @PrimaryGeneratedColumn()
  id_autor: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  nome: string;

  @ManyToMany(() => Livro, (livro) => livro.autores)
  livros: Livro[];
}
