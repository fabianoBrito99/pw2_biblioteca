import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AppController } from './app.controller';
import { LivrosModule } from './modules/livros/livros.module';


@Module({
  imports: [DatabaseModule, AuthModule, UsersModule, LivrosModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
