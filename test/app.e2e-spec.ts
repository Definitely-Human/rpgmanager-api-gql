import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { User } from '../src/users/entities/user.entity';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('UserService', () => {
  let dataSource: DataSource;
  let app: INestApplication;

  const gql = '/graphql';

  beforeAll(async () => {});

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    dataSource = moduleFixture.get(DataSource);
    await dataSource.createQueryBuilder().delete().from(User).execute();

    await app.init();
  });

  afterEach(async () => {
    // await dataSource.createQueryBuilder().delete().from(User).execute();
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    app.close();
  });

  it('createAccount', () => {
    return request(app.getHttpServer())
      .post(gql)
      .send({
        query: `
        mutation {
          createAccount(
            input: {
              email: "test@example.com"
              username: "test"
              password: "test1234"
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
});
