import { Injectable } from '@nestjs/common';
import {
  DataSource,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';
import { Character } from '../character/entities/character.entity';
import { List } from './entities/list.entity';

@Injectable()
export class ListRepository extends Repository<List> {
  constructor(private dataSource: DataSource) {
    super(List, dataSource.createEntityManager());
  }

  async findWithCharacter(
    options: FindManyOptions<List>,
    character: Character,
  ): Promise<List[]> {
    options.where = { ...options.where, character: { id: character.id } };
    return this.find(options);
  }

  async findOneWithCharacter(
    options: FindOneOptions<List>,
    character: Character,
  ): Promise<List> {
    options.where = { ...options.where, character: { id: character.id } };
    return this.findOne(options);
  }
}
