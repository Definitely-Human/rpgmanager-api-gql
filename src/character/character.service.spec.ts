import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CharacterService } from './character.service';
import { Character } from './entities/character.entity';

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('CharacterService', () => {
  let service: CharacterService;
  let characterRepository: MockRepository<Character>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharacterService,
        { provide: getRepositoryToken(Character), useValue: mockRepository() },
      ],
    }).compile();

    service = module.get<CharacterService>(CharacterService);
    characterRepository = module.get(getRepositoryToken(Character));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('to succeed if character not exist', async () => {
    const charData = { name: 'Bob' };
    characterRepository.findOne.mockResolvedValue(null);
    characterRepository.save.mockResolvedValue(charData);
    const result = await service.createCharacter(charData, new User());
    expect(result).toEqual({ ok: true, error: undefined, character: charData });
  });

  it('to fail if character exists', async () => {
    characterRepository.findOne.mockResolvedValue({
      name: 'bob',
    });
    const result = await service.createCharacter({ name: 'bob' }, new User());
    expect(result.ok).toBeFalsy();
    expect(result.error).toEqual(expect.any(String));
    expect(result.character).toBeFalsy();
  });
});
