import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../../src/app.module';

describe('Store Time Record (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/v1/batidas (POST)', async () => {
    const date = new Date('2023-04-17T09:00:00Z');

    const response = await request(app.getHttpServer())
      .post('/batidas')
      .send({
        momento: date.toISOString(),
      })
      .expect(201);

    console.log('body: ', response.body);
  });
});
