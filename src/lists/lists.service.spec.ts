import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from '../categories/categories.service';
import { ListRepository } from './lists.repository';
import { ListsService } from './lists.service';

const mockRepository = {
  findOne: jest.fn(),
  findOneWithCharacter: jest.fn(),
  find: jest.fn(),
  findWithCharacter: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
};

const mockCategoriesService = () => ({
  getCategory: jest.fn(),
});

describe('ListsService', () => {
  let service: ListsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListsService,
        { provide: ListRepository, useValue: mockRepository },
        {
          provide: CategoriesService,
          useValue: mockCategoriesService(),
        },
      ],
    }).compile();

    service = module.get<ListsService>(ListsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
