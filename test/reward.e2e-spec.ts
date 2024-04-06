import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { CharacterService } from '../src/character/character.service';
import { CreateCharacterInput } from '../src/character/dtos/create-character.dto';
import { CreateRewardInput } from '../src/rewards/dtos/create-reward.dto';
import { RewardsService } from '../src/rewards/rewards.service';
import { CreateTaskInput } from '../src/tasks/dtos/create-task.dto';
import { TasksService } from '../src/tasks/tasks.service';
import { CreateAccountInput } from '../src/users/dtos/create-account.dto';
import { User } from '../src/users/entities/user.entity';
import { UsersService } from '../src/users/users.service';

describe('Task e2e tests', () => {
  let dataSource: DataSource;
  let app: INestApplication;
  let moduleFixture: TestingModule;

  const gql = '/graphql';

  const testUserInput: CreateAccountInput = {
    email: 'test@example.com',
    username: 'testUser',
    password: 'test1234',
  };

  const testTaskInput: CreateTaskInput = {
    content: 'Live until tomorrow',
    title: 'Live',
    due_to: new Date('2023-10-07T14:56:17.000Z'),
    is_favorite: true,
  };

  const testRewardInput: CreateRewardInput = {
    experience: 15,
    coins: 25,
  };

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    dataSource = moduleFixture.get(DataSource);

    await app.init();
  });

  afterEach(async () => {
    await dataSource.dropDatabase();
    await app.close();
  });

  describe('private tests', () => {
    let usersService: UsersService;
    let token: string;
    let characterService: CharacterService;
    let thisTestUser: User;
    const testCharacter: CreateCharacterInput = {
      name: 'Bob',
    };

    beforeEach(async () => {
      usersService = moduleFixture.get<UsersService>(UsersService);
      const authService = moduleFixture.get<AuthService>(AuthService);
      await usersService.createAccount(testUserInput);
      await authService
        .login({
          usernameOrEmail: testUserInput.email,
          password: testUserInput.password,
        })
        .then((val) => {
          token = val.token;
        });
      characterService = moduleFixture.get<CharacterService>(CharacterService);
      thisTestUser = await usersService.getUserById(1);
      await characterService
        .createCharacter(testCharacter, thisTestUser)
        .then((val) => (thisTestUser.character = val.character));
    });

    it('should create reward', () => {
      return request(app.getHttpServer())
        .post(gql)
        .set('x-jwt', token)
        .send({
          query: `
          mutation {
            createReward(
              input: {
                coins: ${testRewardInput.coins}
                experience: ${testRewardInput.experience}
              }
            ){
              ok
              error
              reward{
                id
                coins
                experience
              }
            }
          }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createReward).toMatchObject({
            ok: true,
            error: null,
            reward: {
              id: 1,
              coins: testRewardInput.coins,
              experience: testRewardInput.experience,
            },
          });
        });
    });

    it('should edit reward', async () => {
      const rewardsService: RewardsService =
        moduleFixture.get<RewardsService>(RewardsService);
      await rewardsService.createReward(testRewardInput, thisTestUser);
      return request(app.getHttpServer())
        .post(gql)
        .set('x-jwt', token)
        .send({
          query: `
          mutation {
            editReward(
              input: {
                rewardId: 1
                coins: ${testRewardInput.coins * 2}
                experience: ${testRewardInput.experience * 2}
              }
            ){
              ok
              error
              reward{
                id
                coins
                experience
              }
            }
          }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.editReward).toMatchObject({
            ok: true,
            error: null,
            reward: {
              id: 1,
              coins: testRewardInput.coins * 2,
              experience: testRewardInput.experience * 2,
            },
          });
        });
    });

    it('should receive reward and mark it as complete when all associated tasks are complete. ', async () => {
      const rewardsService: RewardsService =
        moduleFixture.get<RewardsService>(RewardsService);
      await rewardsService.createReward(testRewardInput, thisTestUser);
      const tasksService: TasksService =
        moduleFixture.get<TasksService>(TasksService);
      await tasksService.createTask(
        { ...testTaskInput, rewardId: 1 },
        thisTestUser,
      );
      return request(app.getHttpServer())
        .post(gql)
        .set('x-jwt', token)
        .send({
          query: `
          mutation {
            editTask(
              input: {
                taskId:1
                is_complete:true
              }
            ){
              ok
              error
              task {
                  id
              }
            }
          }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.editTask).toEqual({
            ok: true,
            error: null,
            task: { id: 1 },
          });
        })
        .expect(async () => {
          const characterService: CharacterService =
            moduleFixture.get<CharacterService>(CharacterService);
          const characterOutput = await characterService.getCharacter({
            characterId: 1,
          });
          expect(characterOutput.character).toMatchObject({
            experience: testRewardInput.experience,
            coins: testRewardInput.coins,
          });
        })
        .expect(async () => {
          const rewardsOutput = await rewardsService.checkIfRewardReceived(1);
          expect(rewardsOutput).toBeTruthy();
        });
    });
  });
});
