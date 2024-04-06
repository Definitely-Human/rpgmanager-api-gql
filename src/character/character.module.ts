import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacterResolver } from './character.resolver';
import { CharacterService } from './character.service';
import { Character } from './entities/character.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Character])],
  providers: [CharacterService, CharacterResolver],
})
export class CharacterModule {}
