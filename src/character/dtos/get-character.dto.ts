import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { Character } from '../entities/character.entity';

@InputType()
export class GetCharacterInput {
  @Field((type) => Int)
  characterId: number;
}

@ObjectType()
export class GetCharacterOutput extends CoreOutput {
  @Field((type) => Character, { nullable: true })
  character?: Character;
}
