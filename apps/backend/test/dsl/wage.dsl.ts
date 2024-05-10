import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DATABASE } from '../../src/database/constants';
import { Database } from '../../src/database/database.type';

export type AvailableBalanceParams = { currency: 'USD' | 'ARS' };
export type RequestWageAccessParams = {
  currency: 'USD' | 'ARS';
  amount: number;
};
export type CreateEmployeeWageCommand = {
  employeeId: string;
  amount: number;
  currency: 'USD' | 'ARS';
};
export function wage(app: INestApplication) {
  return Object.freeze({
    availableBalance: (
      params: { currency: 'USD' | 'ARS' },
      options?: { userId?: string },
    ) => {
      const req = request(app.getHttpServer()).get(
        `/api/wages/balance?currency=${params.currency ?? ''}`,
      );
      if (options.userId) {
        req.set('x-user-id', options.userId);
      }
      return req;
    },
    requestAccess: (
      params: RequestWageAccessParams,
      options?: { userId?: string },
    ) => {
      const req = request(app.getHttpServer()).post(`/api/wages/requests`);
      if (options.userId) {
        req.set('x-user-id', options.userId);
      }
      return req.send(params);
    },
    createEmployeeWage(data: CreateEmployeeWageCommand) {
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
    createEmployeeWages(data: CreateEmployeeWageCommand[]) {
      const db = app.get<Database>(DATABASE);
      return db
        .insertInto('employee_wages')
        .values(
          data.map((wage) => ({
            employee_id: wage.employeeId,
            currency: wage.currency,
            total_earned_wages: wage.amount,
          })),
        )
        .execute();
    },
  });
}
