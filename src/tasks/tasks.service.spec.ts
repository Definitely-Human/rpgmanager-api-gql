import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoriesService } from '../categories/categories.service';
import { RewardsService } from '../rewards/rewards.service';
import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';

const mockRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
};

const mockCategoriesService = () => ({
  getCategory: jest.fn(),
});

const mockRewardsService = () => ({
  getReward: jest.fn(),
  checkIfRewardShouldBeReceived: jest.fn(),
});

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(Task), useValue: mockRepository },
        { provide: CategoriesService, useValue: mockCategoriesService() },
        { provide: RewardsService, useValue: mockRewardsService() },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
