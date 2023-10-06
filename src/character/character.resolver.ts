import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from '../auth/authUser.decorator';
import { CharacterService } from './character.service';
import {
  CreateCharacterInput,
  CreateCharacterOutput,
} from './dtos/create-character.dto';
import {
  GetCharacterInput,
  GetCharacterOutput,
} from './dtos/get-character.dto';
import { Character } from './entities/character.entity';

@Resolver((of) => Character)
export class CharacterResolver {
  constructor(private readonly characterService: CharacterService) {}

  @Mutation((returns) => CreateCharacterOutput)
  async createCharacter(
    @Args('input')
    createCharacterInput: CreateCharacterInput,
    @AuthUser() authUser,
  ): Promise<CreateCharacterOutput> {
    return this.characterService.createCharacter(
      createCharacterInput,
      authUser,
    );
  }

  @Query((returns) => GetCharacterOutput)
  async getCharacter(
    @Args('input')
    getCharacterInput: GetCharacterInput,
  ): Promise<GetCharacterOutput> {
    return this.characterService.getCharacter(getCharacterInput);
  }
}
