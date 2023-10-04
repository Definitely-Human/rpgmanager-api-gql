import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersService } from '../src/users/users.service';
import { CreateAccountInput } from '../src/users/dtos/create-account.dto';
import { AuthService } from '../src/auth/auth.service';
import { Verification } from '../src/users/entities/verification.entity';

describe('UserService', () => {
  let dataSource: DataSource;
  let app: INestApplication;
  let moduleFixture: TestingModule;

  const gql = '/graphql';

  const testUser: CreateAccountInput = {
    email: 'test@example.com',
    username: 'testUser',
    password: 'test1234',
  };

  beforeAll(async () => {});

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

  afterAll(async () => {});

  describe('public tests', () => {
    it('should create account', () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation {
            createAccount(
              input: {
                email: "${testUser.email}"
                username: "${testUser.username}"
                password: "${testUser.password}"
              }
            ) {
              ok
              error
            }
          }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createAccount).toEqual({
            ok: true,
            error: null,
          });
        });
    });
    it('should fail to create account if email exists', async () => {
      const usersService = moduleFixture.get<UsersService>(UsersService);
      await usersService.createAccount(testUser);
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation {
            createAccount(
              input: {
                email: "${testUser.email}"
                username: "random123"
                password: "${testUser.password}"
              }
            ) {
              ok
              error
            }
          }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createAccount.ok).toBeFalsy();
          expect(res.body.data.createAccount.error).toEqual(expect.any(String));
        });
    });

    it('should return token on login', async () => {
      const usersService = moduleFixture.get<UsersService>(UsersService);
      await usersService.createAccount(testUser);
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          {
            login(input: { usernameOrEmail: "${testUser.username}", password: "${testUser.password}" }) {
              ok
              error
              token
            }
          }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.login).toMatchObject({
            ok: true,
            error: null,
          });
          expect(res.body.data.login.token).toMatch(
            /(^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$)/,
          );
        });
    });

    it('should not return token with wrong credentials', async () => {
      const usersService = moduleFixture.get<UsersService>(UsersService);
      await usersService.createAccount(testUser);
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          {
            login(input: { usernameOrEmail: "${testUser.username}", password: "${testUser.password}1" }) {
              ok
              error
              token
            }
          }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.login).toMatchObject({
            ok: false,
            token: null,
          });
          expect(res.body.data.login.error).toEqual(expect.any(String));
        });
    });
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

    it('should return logged in user data', () => {
      return request(app.getHttpServer())
        .post(gql)
        .set('x-jwt', token)
        .send({
          query: `
          {
            me{
              ok
              error
              user {
                username
                email
                password
              }
            }
          }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.me).toEqual({
            ok: true,
            error: null,
            user: {
              username: testUser.username,
              email: testUser.email,
              password: '',
            },
          });
        });
    });

    it('should fail to return logged in user data if token is incorrect', () => {
      return request(app.getHttpServer())
        .post(gql)
        .set('x-jwt', token + '1')
        .send({
          query: `
          {
            me{
              ok
              error
              user {
                username
                email
              }
            }
          }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors[0].message).toEqual(expect.any(String));
        });
    });

    it("should return specified user's public data", async () => {
      usersService = moduleFixture.get<UsersService>(UsersService);
      const testUser2 = {
        username: 'testUser2',
        email: 'test2@example.com',
        password: testUser.password,
      };
      await usersService.createAccount(testUser2);
      return request(app.getHttpServer())
        .post(gql)
        .set('x-jwt', token)
        .send({
          query: `
          {
            getUser(input: {userId: 2}){
              ok
              error
              user {
                username
                id
              }
            }
          }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.getUser).toEqual({
            ok: true,
            error: null,
            user: {
              username: testUser2.username,
              id: 2,
            },
          });
        });
    });
    it('should return nothing if user does not exist', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .set('x-jwt', token)
        .send({
          query: `
          {
            getUser(input: {userId: 2}){
              ok
              error
              user {
                username
                id
              }
            }
          }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.getUser).toMatchObject({
            ok: false,
            user: null,
          });
          expect(res.body.data.getUser.error).toEqual(expect.any(String));
        });
    });
    it("should edit user's account", async () => {
      const newData = {
        email: 'new@example.com',
        password: 'newPass123',
      };
      return request(app.getHttpServer())
        .post(gql)
        .set('x-jwt', token)
        .send({
          query: `
          mutation {
            editUser(input: {email: "${newData.email}" password:"${newData.password}"}){
              ok
              error
              user {
                email
                password
              }
            }
          }
          `,
        })
        .expect(200)
        .expect((res) => {
          console.log(res.body);
          expect(res.body.data.editUser).toEqual({
            ok: true,
            error: null,
            user: {
              email: newData.email,
              password: '',
            },
          });
        });
    });
    it('should create new email verification when changing email', async () => {
      const verification = await dataSource
        .getRepository(Verification)
        .createQueryBuilder('verification')
        .getOne();
      const newData = {
        email: 'new@example.com',
      };
      return request(app.getHttpServer())
        .post(gql)
        .set('x-jwt', token)
        .send({
          query: `
          mutation {
            editUser(input: {email: "${newData.email}"}){
              ok
              error
            }
          }
          `,
        })
        .expect(200)
        .expect(async (res) => {
          expect(res.body.data.editUser).toEqual({
            ok: true,
            error: null,
          });
          const newVerification = await dataSource
            .getRepository(Verification)
            .createQueryBuilder('verification')
            .getOne();
          expect(newVerification.code).not.toEqual(verification.code);
        });
    });
    it('should return specified profile', async () => {
      usersService = moduleFixture.get<UsersService>(UsersService);
      const testUser2 = {
        username: 'testUser2',
        email: 'test2@example.com',
        password: testUser.password,
      };
      await usersService.createAccount(testUser2);
      return request(app.getHttpServer())
        .post(gql)
        .set('x-jwt', token)
        .send({
          query: `
          {
            getProfile(input: { profileId: 1 }) {
              ok
              error
              profile {
                isOnline
                id
              }
            }
          }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.getProfile).toEqual({
            ok: true,
            error: null,
            profile: {
              isOnline: false,
              id: '1',
            },
          });
        });
    });
    it("should edit user's profile", async () => {
      const newData = {
        firstName: 'Bob',
        lastName: 'Smith',
      };
      return request(app.getHttpServer())
        .post(gql)
        .set('x-jwt', token)
        .send({
          query: `
          mutation {
            editProfile(input: {firstName: "${newData.firstName}" lastName: "${newData.lastName}"}){
              ok
              error
              profile {
                id
                firstName
                lastName
              }
            }
          }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.editProfile).toEqual({
            ok: true,
            error: null,
            profile: {
              id: '1',
              firstName: newData.firstName,
              lastName: newData.lastName,
            },
          });
        });
    });
    it("should verify user's email", async () => {
      const verification = await dataSource
        .getRepository(Verification)
        .createQueryBuilder('verification')
        .getOne();
      return request(app.getHttpServer())
        .post(gql)
        .set('x-jwt', token)
        .send({
          query: `
          mutation {
            verifyEmail(input: {code:"${verification.code}"}){
              ok
              error
            }
          }
          `,
        })
        .expect(200)
        .expect(async (res) => {
          expect(res.body.data.verifyEmail).toEqual({
            ok: true,
            error: null,
          });
          const verificationExists = await dataSource
            .getRepository(Verification)
            .createQueryBuilder('verification')
            .getOne();
          expect(verificationExists).toBe(null);
        });
    });
    it("should not verify user's email with incorrect code", async () => {
      const verification = await dataSource
        .getRepository(Verification)
        .createQueryBuilder('verification')
        .getOne();
      return request(app.getHttpServer())
        .post(gql)
        .set('x-jwt', token)
        .send({
          query: `
          mutation {
            verifyEmail(input: {code:"asdfa"}){
              ok
              error
            }
          }
          `,
        })
        .expect(200)
        .expect(async (res) => {
          expect(res.body.data.verifyEmail.ok).toBe(false);
          expect(res.body.data.verifyEmail.error).toEqual(expect.any(String));
          const verificationExists = await dataSource
            .getRepository(Verification)
            .createQueryBuilder('verification')
            .getOne();
          expect(verificationExists).toEqual(verification);
        });
    });
  });
});
