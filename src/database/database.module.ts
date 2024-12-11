import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'pw2_biblioteca',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: false, // Disable auto-syncing
      migrationsRun: true, // Run migrations manually if necessary
      namingStrategy: new SnakeNamingStrategy(),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
