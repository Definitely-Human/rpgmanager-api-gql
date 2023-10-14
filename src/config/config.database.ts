import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';
import { Character } from '../character/entities/character.entity';
import { ListItem } from '../lists/entities/list-item.entity';
import { List } from '../lists/entities/list.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { Reward } from '../rewards/entities/reward.entity';
import { Task } from '../tasks/entities/task.entity';
import { User } from '../users/entities/user.entity';
import { Verification } from '../users/entities/verification.entity';

const environment = {
  dev: {
    synchronize: true,
    logging: true,
  },
  test: {
    synchronize: true,
    logging: false,
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
  entities: [
    User,
    Verification,
    Profile,
    Character,
    Task,
    Category,
    Reward,
    List,
    ListItem,
  ],
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
