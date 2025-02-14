import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Livro } from './livro.entity';

@Entity('emprestimos')
export class Emprestimos {
  @PrimaryGeneratedColumn()
  id_emprestimo: number;

  @Column({ type: 'date' })
  data_emprestimo: Date;

  @Column({ type: 'date' })
  data_prevista_devolucao: Date;

  @Column({ type: 'date', nullable: true })
  data_devolucao?: Date;

  @ManyToOne(() => Livro, (livro) => livro.emprestimos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_id_livro' })
  livro: Livro;
}
