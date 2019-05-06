import { Sequelize } from 'sequelize-typescript';
import { Module } from '@nestjs/common';

export const databaseProviders = [
  {
    provide: 'Sequelize',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: "123456",
        database: "mydb",
        modelPaths: [__dirname + '/../modules/**/*.entity.[tj]s'],
        logging: false
      });
      return sequelize;
    }
  }
]

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders]
})
export class DatabaseModule {}
