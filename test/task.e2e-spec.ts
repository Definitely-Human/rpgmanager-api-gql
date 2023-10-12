import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { CategoriesService } from '../src/categories/categories.service';
import { CharacterService } from '../src/character/character.service';
import { CreateCharacterInput } from '../src/character/dtos/create-character.dto';
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

  const testUser: CreateAccountInput = {
    email: 'test@example.com',
    username: 'testUser',
    password: 'test1234',
  };

  const testTask: CreateTaskInput = {
    content: 'Live until tomorrow',
    title: 'Live',
    due_to: new Date('2023-10-07T14:56:17.000Z'),
    is_favorite: true,
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

    beforeEach(async () => {
      usersService = moduleFixture.get<UsersService>(UsersService);
      const authService = moduleFixture.get<AuthService>(AuthService);
      await usersService.createAccount(testUser);
      await authService
        .login({
          usernameOrEmail: testUser.email,
          password: testUser.password,
        })
        .then((val) => {
          token = val.token;
        });
    });

    describe('no character tests', () => {
      it('Should fail to create task when character does not exist', () => {
        return request(app.getHttpServer())
          .post(gql)
          .set('x-jwt', token)
          .send({
            query: `
          mutation {
            createTask(
              input: {
                content: "${testTask.title}"
                title: "${testTask.content}"
                due_to: "${testTask.due_to}"
                is_favorite: ${testTask.is_favorite}
              }
            ){
              ok
              error
              task{
                id
                content
                title
                due_to
                completion_time
                is_complete
                is_deleted
                is_favorite
                category{
                  id
                  name
                }
              }
            }
          }
          `,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.createTask.ok).toBeFalsy();
            expect(res.body.data.createTask.error).toEqual(expect.any(String));
          });
      });
    });

    describe('character tests', () => {
      let characterService: CharacterService;
      let thisTestUser: User;
      const testCharacter: CreateCharacterInput = {
        name: 'Bob',
      };

      beforeEach(async () => {
        characterService =
          moduleFixture.get<CharacterService>(CharacterService);
        thisTestUser = await usersService.getUserById(1);
        await characterService
          .createCharacter(testCharacter, thisTestUser)
          .then((val) => (thisTestUser.character = val.character));
      });

      it('should create task', () => {
        return request(app.getHttpServer())
          .post(gql)
          .set('x-jwt', token)
          .send({
            query: `
            mutation {
              createTask(
                input: {
                  content: "${testTask.content}"
                  title: "${testTask.title}"
                  due_to: "${testTask.due_to}"
                  is_favorite: ${testTask.is_favorite}
                }
              ){
                ok
                error
                task{
                  id
                  content
                  title
                  due_to
                  completion_time
                  is_complete
                  is_deleted
                  is_favorite
                  category{
                    id
                    name
                  }
                }
              }
            }
            `,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.createTask).toMatchObject({
              ok: true,
              error: null,
              task: {
                id: 1,
                content: testTask.content,
                title: testTask.title,
                completion_time: null,
                is_deleted: false,
                is_complete: false,
                is_favorite: testTask.is_favorite,
                category: null,
              },
            });
            expect(new Date(res.body.data.createTask.task.due_to)).toEqual(
              testTask.due_to,
            );
          });
      });

      it('should fail to create task with non-existing category', () => {
        return request(app.getHttpServer())
          .post(gql)
          .set('x-jwt', token)
          .send({
            query: `
            mutation {
              createTask(
                input: {
                  content: "${testTask.content}"
                  title: "${testTask.title}"
                  due_to: "${testTask.due_to}"
                  is_favorite: ${testTask.is_favorite}
                  categoryId: 1
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
            expect(res.body.data.createTask.ok).toBeFalsy();
            expect(res.body.data.createTask.error).toEqual(expect.any(String));
            expect(res.body.data.createTask.task).toEqual(null);
          });
      });

      it('should fail to create task with other users category', async () => {
        const secondUser: CreateAccountInput = {
          username: 'testUser2',
          email: 'test2@example.com',
          password: 'example123',
        };
        await usersService.createAccount(secondUser);
        const secondUserData = await usersService.getUserById(2);
        const categoryService: CategoriesService =
          moduleFixture.get<CategoriesService>(CategoriesService);
        await categoryService.createCategory(
          { name: 'testCategory' },
          secondUserData,
        );
        return request(app.getHttpServer())
          .post(gql)
          .set('x-jwt', token)
          .send({
            query: `
            mutation {
              createTask(
                input: {
                  content: "${testTask.content}"
                  title: "${testTask.title}"
                  due_to: "${testTask.due_to}"
                  is_favorite: ${testTask.is_favorite}
                  categoryId: 1
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
            expect(res.body.data.createTask.ok).toBeFalsy();
            expect(res.body.data.createTask.error).toEqual(expect.any(String));
            expect(res.body.data.createTask.task).toEqual(null);
          });
      });

      it('should get task', async () => {
        const tasksService: TasksService =
          moduleFixture.get<TasksService>(TasksService);
        await tasksService.createTask(testTask, thisTestUser);
        return request(app.getHttpServer())
          .post(gql)
          .set('x-jwt', token)
          .send({
            query: `
            {
              getTask(input:{taskId:1}){
                ok
                error
                task{
                  id
                  content
                  title
                  completion_time
                  is_complete
                  is_deleted
                  is_favorite
                  category {
                    id
                    name
                  }
                }
              }
            }
              `,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.getTask).toEqual({
              ok: true,
              error: null,
              task: {
                id: 1,
                content: testTask.content,
                title: testTask.title,
                completion_time: null,
                is_deleted: false,
                is_complete: false,
                is_favorite: testTask.is_favorite,
                category: null,
              },
            });
          });
      });
    });
  });
});
