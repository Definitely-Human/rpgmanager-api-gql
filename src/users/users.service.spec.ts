import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ObjectLiteral, Repository } from 'typeorm';
import { MailService } from '../mail/mail.service';
import { Profile } from '../profiles/entities/profile.entity';
import { ProfilesService } from '../profiles/profiles.service';
import { User } from '../users/entities/user.entity';
import { Verification } from './entities/verification.entity';
import { UsersService } from './users.service';

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
});

const mockProfileService = () => ({
  createProfile: jest.fn(() => new Profile()),
});

const mockMailService = () => ({
  sendVerificationEmail: jest.fn(),
});

type MockRepository<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

describe('UserService', () => {
  let service: UsersService;
  let userRepository: MockRepository<User>;
  let verificationRepository: MockRepository<Verification>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockRepository() },
        {
          provide: getRepositoryToken(Verification),
          useValue: mockRepository(),
        },
        {
          provide: ProfilesService,
          useValue: mockProfileService(),
        },
        {
          provide: MailService,
          useValue: mockMailService(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));
    verificationRepository = module.get(getRepositoryToken(Verification));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('to succeed if user not exist', async () => {
    const userData = {
      username: 'user',
      password: 'pass1234',
      email: 'user@example.com',
    };
    userRepository.findOne?.mockResolvedValue(null);
    userRepository.save?.mockResolvedValue(userData);
    verificationRepository.save?.mockResolvedValue({ code: 'abc' });
    const result = await service.createAccount(userData);
    expect(result).toEqual({ ok: true, error: undefined, user: userData });
  });

  it('to fail if user exists', async () => {
    const userData = {
      username: 'user',
      password: 'pass1234',
      email: 'user@example.com',
    };
    userRepository.findOne?.mockResolvedValue({
      userData,
    });
    const result = await service.createAccount(userData);
    expect(result.ok).toBeFalsy();
    expect(result.error).toEqual(expect.any(String));
    expect(result.user).toBeFalsy();
  });
});
