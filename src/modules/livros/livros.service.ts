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

  constructor(private dataSource: DataSource, private readonly estoqueService: EstoqueService) {
    this.livroRepository = this.dataSource.getRepository(Livro);
    this.livroCategoriaRepository = this.dataSource.getRepository(LivroCategoria);
    this.categoriaRepository = this.dataSource.getRepository(Categoria);
    this.autorRepository = this.dataSource.getRepository(Autor);
    this.emprestimosRepository = this.dataSource.getRepository(Emprestimos);
  }

  /** Retorna todos os livros com suas categorias e autores */
  async findAll(): Promise<Livro[]> {
    console.log('🔹 [Service] Buscando todos os livros');
  
    try {
      console.log('🔹 [Service] Buscando livros sem relations...');
      const livrosSemRelations = await this.livroRepository.find({ select: ['id_livro', 'nome_livro'] });
      console.log('✅ [Service] Livros sem relations:', livrosSemRelations);
  
      console.log('🔹 [Service] Buscando categorias dos livros...');
      const livrosComCategorias = await this.livroRepository.find({
        relations: ['categorias'],
        select: ['id_livro', 'nome_livro'],
      });
      console.log('✅ [Service] Livros com categorias:', livrosComCategorias);
  
      console.log('🔹 [Service] Buscando autores dos livros...');
      const livrosComAutores = await this.livroRepository.find({
        relations: ['autores'],
        select: ['id_livro', 'nome_livro'],
      });
      console.log('✅ [Service] Livros com autores:', livrosComAutores);
  
      console.log('🔹 [Service] Buscando livros com todas as relações...');
      const livros = await this.livroRepository.find({
        relations: ['categorias', 'autores'], // ⚠️ Se der erro, o problema está aqui
      });
  
      console.log('✅ [Service] Livros encontrados:', livros);
      return livros;
    } catch (error) {
      console.error('❌ [Service] Erro ao buscar livros:', error);
  
      // 🔹 Debug extra para identificar a relação problemática
      try {
        console.log('🔹 [Service] Buscando IDs das categorias...');
        const categoriasSimples = await this.dataSource.getRepository('Categoria').find({ select: ['id_categoria', 'nome_categoria'] });
        console.log('✅ [Service] Categorias encontradas:', categoriasSimples);
      } catch (err) {
        console.error('❌ [Service] Erro ao buscar categorias:', err);
      }
  
      try {
        console.log('🔹 [Service] Buscando IDs dos autores...');
        const autoresSimples = await this.dataSource.getRepository('Autor').find({ select: ['id_autor', 'nome'] });
        console.log('✅ [Service] Autores encontrados:', autoresSimples);
      } catch (err) {
        console.error('❌ [Service] Erro ao buscar autores:', err);
      }
  
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
      relations: ['categorias', 'autores'],
    });
  }

  /** Cria um novo livro e associa autores e categorias */
  async create(livroData: Partial<Livro>, quantidade_estoque: number, autores: string[]): Promise<Livro> {
    const novoLivro = this.livroRepository.create({ ...livroData, quantidade_estoque });
    const livroSalvo = await this.livroRepository.save(novoLivro);

    // Criar o estoque associado ao livro
  if (quantidade_estoque >= 0) {
    await this.estoqueService.create(quantidade_estoque); 
  }

    // Associar autores ao livro
    for (const nomeAutor of autores) {
      await this.associarAutor(livroSalvo, nomeAutor);
    }

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

    const livroCategoria = this.livroCategoriaRepository.create({ livro, categoria });
    await this.livroCategoriaRepository.save(livroCategoria);
  }

  /** Associa um autor a um livro */
  async associarAutor(livro: Livro, nomeAutor: string): Promise<void> {
    let autor = await this.autorRepository.findOne({ where: { nome: nomeAutor } });

    if (!autor) {
      autor = this.autorRepository.create({ nome: nomeAutor });
      await this.autorRepository.save(autor);
    }

    livro.autores = livro.autores ? [...livro.autores, autor] : [autor];
    await this.livroRepository.save(livro);
  }

  /** Criar uma reserva */
  async reservarLivro(id_livro: number, id_usuario: number): Promise<void> {
    const livro = await this.livroRepository.findOne({ where: { id_livro } });

    if (!livro || livro.quantidade_estoque <= 0) {
      throw new Error('Livro indisponível para reserva');
    }

    // Criar o empréstimo corretamente
    const emprestimo = this.emprestimosRepository.create({
      data_emprestimo: new Date(),
      data_prevista_devolucao: new Date(new Date().setDate(new Date().getDate() + 7)),
      fk_id_livro: id_livro,
    });

    const emprestimoSalvo = await this.emprestimosRepository.save(emprestimo);

    if (!emprestimoSalvo || !emprestimoSalvo.id_emprestimo) {
      throw new Error('Erro ao salvar empréstimo.');
    }

    // Relacionar usuário ao empréstimo
    await this.emprestimosRepository.query(
      `INSERT INTO usuario_emprestimos (fk_id_usuario, fk_id_emprestimo) VALUES (?, ?)`,
      [id_usuario, emprestimoSalvo.id_emprestimo],
    );

    // Atualizar estoque
    livro.quantidade_estoque -= 1;
    await this.livroRepository.save(livro);
  }
}
