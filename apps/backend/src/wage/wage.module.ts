import { Module } from '@nestjs/common';
import { WageController } from './wage.controller';
import { DatabaseModule } from '../database/database.module';
import { WageService } from './application/wage.service';
import { EmployeeWagesRepository } from './infra/employee-wages.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [WageController],
  providers: [WageService, EmployeeWagesRepository],
})
export class WageModule {}
