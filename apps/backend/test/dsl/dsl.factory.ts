import { INestApplication } from '@nestjs/common';
import { wage } from './wage.dsl';
import { employee } from './employee.dsl';

export function createDSL(app: INestApplication) {
  return Object.freeze({
    wage: wage(app),
    employee: employee(app),
  });
}

export type DSL = ReturnType<typeof createDSL>;
