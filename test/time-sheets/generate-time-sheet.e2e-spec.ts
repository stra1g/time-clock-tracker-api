import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../../src/app.module';

describe('Generate Time Sheet (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/v1/folhas-de-ponto/:anoMes (GET)', async () => {
    const firstDate = new Date('2024-09-02T09:00:00Z');
    const secondDate = new Date('2024-09-02T13:00:00Z');

    const yearMonth = '2024-09';

    await request(app.getHttpServer())
      .post('/batidas')
      .send({
        momento: firstDate.toISOString(),
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/batidas')
      .send({
        momento: secondDate.toISOString(),
      })
      .expect(201);

    const response = await request(app.getHttpServer())
      .get(`/folhas-de-ponto/${yearMonth}`)
      .expect(200);

    expect(response.body).toHaveProperty('anoMes');
    expect(response.body).toHaveProperty('horasTrabalhadas');
    expect(response.body).toHaveProperty('horasExcedentes');
    expect(response.body).toHaveProperty('horasDevidas');
    expect(response.body).toHaveProperty('expedientes');
    expect(response.body.anoMes).toBe('2024-09');
    expect(response.body.horasTrabalhadas).toBe('4');
    expect(response.body.horasExcedentes).toBe('0');
    expect(response.body.horasDevidas).toBe('156');
    expect(response.body.expedientes).toHaveLength(1);
    expect(response.body.expedientes[0]).toHaveProperty('dia');
    expect(response.body.expedientes[0]).toHaveProperty('pontos');
    expect(response.body.expedientes[0].pontos).toHaveLength(2);
    expect(response.body.expedientes[0].dia).toBe('2024-09-02');
    expect(response.body.expedientes[0].pontos[0]).toBe('09:00:00');
    expect(response.body.expedientes[0].pontos[1]).toBe('13:00:00');
  });
});
