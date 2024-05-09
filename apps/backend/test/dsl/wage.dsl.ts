import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export function wage(app: INestApplication) {
  return Object.freeze({
    availableBalance: (
      params: { currency: 'USD' | 'ARS' },
      options?: { userId?: string },
    ) => {
      const req = request(app.getHttpServer()).get(
        `/api/wage/balance?currency=${params.currency}`,
      );
      if (options.userId) {
        req.set('x-user-id', options.userId);
      }
      return req;
    },
  });
}
