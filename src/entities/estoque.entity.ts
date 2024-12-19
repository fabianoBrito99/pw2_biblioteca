import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Livro } from './livro.entity';

@Entity('estoque')
export class Estoque {
  @PrimaryGeneratedColumn()
  id_estoque: number;

  @ManyToOne(() => Livro, livro => livro.id_livro) 
  livro: Livro;
  @Column()
  quantidade_estoque: number;
}
