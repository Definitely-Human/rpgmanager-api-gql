import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Character } from '../character/entities/character.entity';
import { Task } from '../tasks/entities/task.entity';
import { Reward } from './entities/reward.entity';
import { RewardsService } from './rewards.service';

const mockRepository = {
  findOne: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
};

describe('RewardsService', () => {
  let service: RewardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RewardsService,
        { provide: getRepositoryToken(Reward), useValue: mockRepository },
        { provide: getRepositoryToken(Task), useValue: mockRepository },
        { provide: getRepositoryToken(Character), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<RewardsService>(RewardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
