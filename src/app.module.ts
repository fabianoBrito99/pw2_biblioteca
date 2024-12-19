import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AppController } from './app.controller';
import { LivrosModule } from './modules/livros/livros.module';
import { CategoriaModule } from './modules/categoria/categoria.module';
import { EstoqueModule } from './modules/estoque/estoque.module';


@Module({
  imports: [DatabaseModule, AuthModule, UsersModule, LivrosModule, CategoriaModule, EstoqueModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
