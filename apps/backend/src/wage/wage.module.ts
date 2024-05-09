import { Module } from '@nestjs/common';
import { WageController } from './wage.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [WageController],
})
export class WageModule {}
