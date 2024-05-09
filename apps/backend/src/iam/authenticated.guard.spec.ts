import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { USER_HEADER } from './headers';
import { IamModule } from './iam.module';
import { AuthenticatedGuardTestController } from './test/authenticated-guard-test.controller';

describe('AuthenticatedGuard', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [IamModule],
      controllers: [AuthenticatedGuardTestController],
    }).compile();

    app = testingModule.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('protected routes', () => {
    test('returns false when request does not have x-user-id header', async () => {
      await request(app.getHttpServer()).get('/test/protected').expect(403);
    });
    test('returns true when request has x-user-id header', async () => {
      await request(app.getHttpServer())
        .get('/test/protected')
        .set(USER_HEADER, '1')
        .expect(200);
    });
  });
  describe('unprotected routes', () => {
    test('returns true', async () => {
      await request(app.getHttpServer()).get('/test/unprotected').expect(200);
    });
  });
});
