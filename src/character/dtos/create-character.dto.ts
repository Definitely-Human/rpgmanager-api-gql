import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { Character } from '../entities/character.entity';

@InputType()
export class CreateCharacterInput extends PartialType(
  PickType(Character, ['name']),
) {}

@ObjectType()
export class CreateCharacterOutput extends CoreOutput {
  @Field((type) => Character, { nullable: true })
  character?: Character;
}
