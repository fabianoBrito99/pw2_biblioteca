import { Module } from '@nestjs/common';
import { LivrosService } from './livros.service';
import { LivrosController } from './livros.controller';
import { EstoqueModule } from '../estoque/estoque.module';
import { CategoriaModule } from '../categoria/categoria.module';

@Module({
  imports: [EstoqueModule, CategoriaModule],
  controllers: [LivrosController],
  providers: [LivrosService],
  exports: [LivrosService],
})
export class LivrosModule {}
