import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Livro {
  @PrimaryGeneratedColumn()
  id_livro: number;

  @Column()
  nome_livro: string;

  @Column()
  descricao: string;

  @Column()
  ano_publicacao: number;
}
