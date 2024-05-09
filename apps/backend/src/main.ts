import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureApplication } from 'src/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApplication(app);
  await app.listen(3000);
}
bootstrap();
