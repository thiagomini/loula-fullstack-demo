import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DATABASE } from '../../src/database/constants';
import { Database } from '../../src/database/database.type';

export type AvailableBalanceParams = { currency: 'USD' | 'ARS' };
export function wage(app: INestApplication) {
  return Object.freeze({
    availableBalance: (
      params: { currency: 'USD' | 'ARS' },
      options?: { userId?: string },
    ) => {
      const req = request(app.getHttpServer()).get(
        `/api/wage/balance?currency=${params.currency ?? ''}`,
      );
      if (options.userId) {
        req.set('x-user-id', options.userId);
      }
      return req;
    },
    createEmployeeWage(data: {
      employeeId: string;
      amount: number;
      currency: 'USD' | 'ARS';
    }) {
      const db = app.get<Database>(DATABASE);
      return db
        .insertInto('employee_wages')
        .values({
          employee_id: data.employeeId,
          currency: data.currency,
          total_earned_wages: data.amount,
        })
        .executeTakeFirst();
    },
  });
}
