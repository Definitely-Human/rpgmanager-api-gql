import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { Character } from '../entities/character.entity';

@InputType()
export class GetCharacterInput extends PickType(Character, ['id']) {}

@ObjectType()
export class GetCharacterOutput extends CoreOutput {
  @Field((type) => Character, { nullable: true })
  character?: Character;
}
