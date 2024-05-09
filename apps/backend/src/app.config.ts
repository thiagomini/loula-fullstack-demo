import { INestApplication } from '@nestjs/common';

export function configureApplication(app: INestApplication) {
  app.setGlobalPrefix('api');
}
