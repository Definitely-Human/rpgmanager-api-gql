import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { Character } from '../entities/character.entity';

@InputType()
export class DeleteCharacterInput extends PickType(Character, ['name']) {}

@ObjectType()
export class DeleteCharacterOutput extends CoreOutput {}
