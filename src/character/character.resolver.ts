import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from '../auth/authUser.decorator';
import { User } from '../users/entities/user.entity';
import { CharacterService } from './character.service';
import {
  CreateCharacterInput,
  CreateCharacterOutput,
} from './dtos/create-character.dto';
import {
  DeleteCharacterInput,
  DeleteCharacterOutput,
} from './dtos/delete-character.dto';
import {
  EditCharacterInput,
  EditCharacterOutput,
} from './dtos/edit-character.dto';
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
    @AuthUser() authUser: User,
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

  @Mutation((returns) => EditCharacterOutput)
  async editCharacter(
    @Args('input')
    editCharacterInput: EditCharacterInput,
    @AuthUser() authUser: User,
  ): Promise<EditCharacterOutput> {
    return this.characterService.editCharacter(editCharacterInput, authUser);
  }

  @Mutation((returns) => DeleteCharacterOutput)
  async deleteCharacter(
    @Args('input')
    deleteCharacterInput: DeleteCharacterInput,
    @AuthUser() authUser: User,
  ): Promise<DeleteCharacterOutput> {
    return this.characterService.deleteCharacter(
      deleteCharacterInput,
      authUser,
    );
  }
}
