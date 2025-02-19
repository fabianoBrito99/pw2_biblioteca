import { Module } from '@nestjs/common';
import { LivrosService } from './livros.service';
import { LivrosController } from './livros.controller';
import { EstoqueModule } from '../estoque/estoque.module';
import { CategoriaModule } from '../categoria/categoria.module';
import { AutorModule } from '../autor/autor.module';

@Module({
  imports: [EstoqueModule, CategoriaModule, AutorModule],
  controllers: [LivrosController],
  providers: [LivrosService],
  exports: [LivrosService],
})
export class LivrosModule {}
