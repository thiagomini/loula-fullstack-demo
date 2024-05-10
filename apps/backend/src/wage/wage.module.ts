import { Module } from '@nestjs/common';
import { WageController } from './wage.controller';
import { DatabaseModule } from '../database/database.module';
import { WageService } from './application/wage.service';

@Module({
  imports: [DatabaseModule],
  controllers: [WageController],
  providers: [WageService],
})
export class WageModule {}
