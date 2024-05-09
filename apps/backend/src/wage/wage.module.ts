import { Module } from '@nestjs/common';
import { WageController } from './wage.controller';

@Module({
  controllers: [WageController],
})
export class WageModule {}
