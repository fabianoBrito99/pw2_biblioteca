import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Livro } from '../../entities/livro.entity';
import { LivroCategoria } from '../../entities/livro_categoria.entity';
import { Categoria } from '../../entities/categoria.entity';
import { EstoqueService } from '../estoque/estoque.service';
import { Autor } from '../../entities/autor.entity';
import { Emprestimos } from '../../entities/emprestimos.entity';

@Injectable()
export class LivrosService {
  private livroRepository;
  private livroCategoriaRepository;
  private categoriaRepository;
  private autorRepository;
  private emprestimosRepository;

  constructor(
    private dataSource: DataSource,
    private readonly estoqueService: EstoqueService,
  ) {
    this.livroRepository = this.dataSource.getRepository(Livro);
    this.livroCategoriaRepository =
      this.dataSource.getRepository(LivroCategoria);
    this.categoriaRepository = this.dataSource.getRepository(Categoria);
    this.autorRepository = this.dataSource.getRepository(Autor);
    this.emprestimosRepository = this.dataSource.getRepository(Emprestimos);
  }

  /** Retorna todos os livros com suas categorias e autores */
  async findAll(): Promise<Livro[]> {
    try {
      console.log('🔹 [Service] Buscando livros sem relations...');
      const livrosSemRelations = await this.livroRepository.find({
        select: ['id_livro', 'nome_livro'],
      });

      const livros = await this.livroRepository.find({
        relations: ['categorias', 'autores'],
      });

      // 🔹 Buscar quantidade_estoque da tabela Estoque
      for (const livro of livros) {
        const estoque = await this.estoqueService.findOne(livro.id_livro);
        livro['quantidade_estoque'] = estoque?.quantidade_estoque || 0; // Evita erro se não houver estoque
      }

      return livros;
    } catch (error) {
      throw new Error('Erro ao buscar livros no banco de dados.');
    }
  }

  /** Retorna um livro específico com categorias */
  async findOne(id: number): Promise<Livro> {
    return await this.livroRepository.findOne({
      where: { id_livro: id },
      relations: ['categorias'],
    });
  }

  /** Retorna um livro detalhado com autores, categorias e estoque */
  async findOneDetalhado(id: number): Promise<Livro> {
    return await this.livroRepository.findOne({
      where: { id_livro: id },
      relations: ['categorias', 'autores', 'estoque'],
    });
  }

  /** Cria um novo livro e associa autores e categorias */
  async create(
    livroData: Partial<Livro>,
    quantidade_estoque: number,
    categoria: Categoria,
    autor: Autor,
  ): Promise<Livro> {
    console.log('🔹 [Service] Criando novo livro:', livroData);

    const novoLivro = this.livroRepository.create({
      ...livroData,
      quantidade_estoque,
      categorias: [categoria],
      autores: [autor],
    });

    const livroSalvo = await this.livroRepository.save(novoLivro);
    console.log('[Service] Livro salvo:', livroSalvo);

    return livroSalvo;
  }

  /** Atualiza um livro existente */
  async update(id: number, livroData: Partial<Livro>): Promise<Livro> {
    await this.livroRepository.update(id, livroData);
    return this.findOneDetalhado(id);
  }

  /** Remove um livro pelo ID */
  async remove(id: number): Promise<void> {
    await this.livroRepository.delete(id);
  }

  /** Associa uma categoria a um livro */
  async associarCategoria(livro: Livro, categoria: Categoria): Promise<void> {
    if (!livro || !categoria) {
      throw new Error('Livro ou Categoria não encontrados');
    }

    const livroCategoria = this.livroCategoriaRepository.create({
      livro,
      categoria,
    });
    await this.livroCategoriaRepository.save(livroCategoria);
  }

  /** Associa um autor a um livro */
  async associarAutor(livro: Livro, nomeAutor: string): Promise<void> {
    let autor = await this.autorRepository.findOne({
      where: { nome: nomeAutor },
    });

    if (!autor) {
      autor = this.autorRepository.create({ nome: nomeAutor });
      await this.autorRepository.save(autor);
    }

    livro.autores = livro.autores ? [...livro.autores, autor] : [autor];
    await this.livroRepository.save(livro);
  }

  /** Criar uma reserva */
  async reservarLivro(id_livro: number, id_usuario: number): Promise<string> {
    // Busca o livro
    const livro = await this.livroRepository.findOne({ where: { id_livro } });

    if (!livro) {
      throw new Error('Livro não encontrado.');
    }

    // Busca o estoque do livro usando o EstoqueService
    const estoque = await this.estoqueService.findOne(id_livro);

    if (!estoque || estoque.quantidade_estoque <= 0) {
      throw new Error('Livro indisponível para reserva.');
    }

    // Diminui o estoque
    estoque.quantidade_estoque -= 1;
    await this.estoqueService.updateQuantidade(
      id_livro,
      estoque.quantidade_estoque,
    );

    // Cria o empréstimo
    const emprestimo = this.emprestimosRepository.create({
      data_emprestimo: new Date(),
      data_prevista_devolucao: new Date(
        new Date().setDate(new Date().getDate() + 7),
      ), // 7 dias para devolução
      data_devolucao: null,
      fk_id_livro: id_livro,
    });

    const emprestimoSalvo = await this.emprestimosRepository.save(emprestimo);

    // Associa usuário ao empréstimo
    await this.emprestimosRepository.query(
      `INSERT INTO usuario_emprestimos (fk_id_usuario, fk_id_emprestimo) VALUES (?, ?)`,
      [id_usuario, emprestimoSalvo.id_emprestimo],
    );

    // Gera um código de reserva
    const codigoReserva = `cod${emprestimoSalvo.id_emprestimo}`;

    return `Livro reservado com sucesso! Vá até a biblioteca e apresente o código: ${codigoReserva}`;
  }
}
