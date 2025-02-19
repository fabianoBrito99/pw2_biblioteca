import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AppController } from './app.controller';
import { LivrosModule } from './modules/livros/livros.module';
import { CategoriaModule } from './modules/categoria/categoria.module';
import { EstoqueModule } from './modules/estoque/estoque.module';
import { AutorModule } from './modules/autor/autor.module';
import { EmprestimosModule } from './modules/emprestimos/emprestismos.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    LivrosModule,
    UsersModule,
    LivrosModule,
    CategoriaModule,
    EstoqueModule,
    AutorModule,
    EmprestimosModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
