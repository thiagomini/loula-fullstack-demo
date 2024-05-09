import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WageModule } from './wage/wage.module';
import { IamModule } from './iam/iam.module';

@Module({
  imports: [WageModule, IamModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
