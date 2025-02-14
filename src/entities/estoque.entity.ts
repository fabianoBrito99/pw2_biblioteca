import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Livro } from './livro.entity';

@Entity('estoque')
export class Estoque {
  @PrimaryGeneratedColumn()
  id_estoque: number;

  @OneToOne(() => Livro, (livro) => livro.estoque, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_id_livro' })
  livro: Livro;
  
  

  @Column()
  quantidade_estoque: number;
}
