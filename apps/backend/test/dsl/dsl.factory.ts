import { INestApplication } from '@nestjs/common';
import { wage } from './wage.dsl';

export function createDSL(app: INestApplication) {
  return Object.freeze({
    wage: wage(app),
  });
}

export type DSL = ReturnType<typeof createDSL>;
