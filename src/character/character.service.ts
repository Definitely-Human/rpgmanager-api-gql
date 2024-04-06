import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import {
  CreateCharacterInput,
  CreateCharacterOutput,
} from './dtos/create-character.dto';
import {
  DeleteCharacterInput,
  DeleteCharacterOutput,
} from './dtos/delete-character.dto';
import { EditCharacterInput } from './dtos/edit-character.dto';
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
        where: { id: getCharacterInput.characterId },
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

  async editCharacter(
    editCharacterInput: EditCharacterInput,
    user: User,
  ): Promise<CreateCharacterOutput> {
    try {
      let character = await this.characters.findOne({
        where: { user: { id: user.id } },
        relations: ['user'],
      });
      if (!character) return { ok: false, error: 'Character not found.' };

      character = { ...character, ...editCharacterInput };

      character = await this.characters.save(character);

      return {
        ok: true,
        character,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Error when editing character.',
      };
    }
  }

  async deleteCharacter(
    deleteCharacterInput: DeleteCharacterInput,
    user: User,
  ): Promise<DeleteCharacterOutput> {
    try {
      const character = await this.characters.findOne({
        where: { user: { id: user.id } },
        loadRelationIds: true,
      });
      if (!character) return { ok: false, error: 'Character not found.' };
      if (deleteCharacterInput.name !== character.name)
        return { ok: false, error: "Character names don't match." };

      this.characters.delete(character.id);

      return { ok: true };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Error when deleting character.',
      };
    }
  }
}
