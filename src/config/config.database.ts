import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Profile } from 'src/profiles/entities/profile.entity';
import { User } from 'src/users/entities/user.entity';
import { Verification } from 'src/users/entities/verification.entity';

const environment = {
  dev: {
    synchronize: true,
    logging: true,
  },
  test: {
    synchronize: true,
    logging: true,
    dropSchema: true,
  },
  prod: {
    synchronize: false,
    logging: false,
  },
};
export const DatabaseConfig = (): TypeOrmModuleOptions => ({
  ...environment[process.env.NODE_ENV],
  type: 'postgres',
  entities: [User, Verification, Profile],
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});