import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity('usuario')
export class Usuario extends BaseEntity {
  @PrimaryGeneratedColumn()
  id_usuario: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  nome_usuario: string;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  senha: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  telefone: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  cep: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  rua: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  bairro: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  numero: string;
}
