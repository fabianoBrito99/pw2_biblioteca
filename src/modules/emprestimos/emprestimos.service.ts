import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Estoque } from '../../entities/estoque.entity';
import { Livro } from '../../entities/livro.entity';
import { Emprestimos } from '../../entities/emprestimos.entity';

@Injectable()
export class EmprestimosService {
  constructor(private dataSource: DataSource) {}

  /** Listar todos os empréstimos */
  async listarEmprestimos(): Promise<Emprestimos[]> {
    return this.dataSource.getRepository(Emprestimos).find({ relations: ['livro'] });
  }

  /** Reservar um livro */
  async reservar(idLivro: number): Promise<Emprestimos> {
    return this.dataSource.transaction(async manager => {
      const estoque = await manager.findOne(Estoque, { where: { livro: { id_livro: idLivro } }, relations: ['livro'] });

      if (!estoque || estoque.quantidade_estoque <= 0) {
        console.error(`[ERRO] Estoque insuficiente para o livro ID ${idLivro}`);
        throw new Error('Livro indisponível para reserva.');
      }

      console.log(`[INFO] Reservando livro: ${estoque.livro.nome_livro} | Estoque atual: ${estoque.quantidade_estoque}`);

      estoque.quantidade_estoque -= 1;
      await manager.save(estoque);

      console.log(`[INFO] Estoque atualizado para ${estoque.quantidade_estoque}`);

      const emprestimo = new Emprestimos();
      emprestimo.livro = estoque.livro;
      emprestimo.data_emprestimo = new Date();
      emprestimo.data_prevista_devolucao = new Date();
      emprestimo.data_prevista_devolucao.setDate(emprestimo.data_emprestimo.getDate() + 7); // 7 dias de prazo

      const novoEmprestimo = await manager.save(emprestimo);

      console.log(`[SUCESSO] Empréstimo registrado para o livro: ${estoque.livro.nome_livro}`);
      return novoEmprestimo;
    });
  }

  /** Devolver um livro */
  async devolver(idEmprestimo: number): Promise<Emprestimos> {
    return this.dataSource.transaction(async manager => {
      const emprestimo = await manager.findOne(Emprestimos, { where: { id_emprestimo: idEmprestimo }, relations: ['livro'] });

      if (!emprestimo || emprestimo.data_devolucao !== null) {
        console.error(`[ERRO] Empréstimo inválido ou já devolvido. ID: ${idEmprestimo}`);
        throw new Error('Este empréstimo não pode ser devolvido.');
      }

      console.log(`[INFO] Devolvendo livro: ${emprestimo.livro.nome_livro}`);

      emprestimo.data_devolucao = new Date();
      await manager.save(emprestimo);

      const estoque = await manager.findOne(Estoque, { where: { livro: emprestimo.livro } });
      if (estoque) {
        estoque.quantidade_estoque += 1;
        await manager.save(estoque);
        console.log(`[INFO] Estoque atualizado para ${estoque.quantidade_estoque}`);
      }

      console.log(`[SUCESSO] Livro devolvido: ${emprestimo.livro.nome_livro}`);
      return emprestimo;
    });
  }
}
