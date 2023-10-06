import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import {
  CreateCharacterInput,
  CreateCharacterOutput,
} from './dtos/create-character.dto';
import {
  GetCharacterInput,
  GetCharacterOutput,
} from './dtos/get-character.dto';
import { Character } from './entities/character.entity';

@Injectable()
export class CharacterService {
  constructor(
    @InjectRepository(Character)
    private readonly characters: Repository<Character>,
  ) {}

  async createCharacter(
    createCharacterInput: CreateCharacterInput,
    user: User,
  ): Promise<CreateCharacterOutput> {
    try {
      let character = await this.characters.findOne({
        where: { user: { id: user.id } },
        relations: ['user'],
      });
      if (character)
        return {
          ok: false,
          error: "Character already exists. Can't create second character",
        };

      character = await this.characters.save(
        this.characters.create({ ...createCharacterInput, user: user }),
      );

      return {
        ok: true,
        character,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Error when creating character',
      };
    }
  }

  async getCharacter(
    getCharacterInput: GetCharacterInput,
  ): Promise<GetCharacterOutput> {
    try {
      const character = await this.characters.findOne({
        where: { id: getCharacterInput.id },
      });

      if (!character) return { ok: false, error: 'Character not found' };
      return { ok: true, character };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Error when retrieving character.',
      };
    }
  }
}
