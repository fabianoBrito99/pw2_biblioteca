import { Module } from '@nestjs/common';
import { LivrosService } from './livros.service';
import { LivrosController } from './livros.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Livro } from '../../entities/livro.entity';
import { LivroCategoria } from '../../entities/livro_categoria.entity';  // Certifique-se de que o caminho está correto
import { CategoriaModule } from '../categoria/categoria.module';
import { DatabaseModule } from '../../database/database.module';
import { EstoqueModule } from '../estoque/estoque.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Livro, LivroCategoria]),  // Incluindo LivroCategoria aqui
    CategoriaModule,
    EstoqueModule,
    DatabaseModule,
  ],
  providers: [LivrosService],
  controllers: [LivrosController],
})
export class LivrosModule {}
