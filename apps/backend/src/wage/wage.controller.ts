import { Body, Controller, Get, Headers, Post, Query } from '@nestjs/common';
import { USER_HEADER } from '../iam/headers';
import { ZodValidationPipe } from '../utils/zod-validation.pipe';
import { WageService } from './application/wage.service';
import { currencySchema } from './currency.validation';
import { Currency } from './domain/currency';
import {
  RequestWageAccessDTO,
  requestWageAccessSchema,
} from './presentation/request-wage-access.dto';

@Controller('wages')
export class WageController {
  constructor(private readonly wageService: WageService) {}

  @Get('balance')
  public async availableBalance(
    @Query('currency', new ZodValidationPipe(currencySchema))
    requestedCurrency: string,
    @Headers(USER_HEADER) employeeId: string,
  ) {
    const totalWagesInCurrency =
      await this.wageService.getEmployeeWagesInCurrency(
        employeeId,
        requestedCurrency as Currency,
      );

    return {
      amount: totalWagesInCurrency.amount,
      currency: requestedCurrency,
    };
  }

  @Post('requests')
  public async requestWageAccess(
    @Body(new ZodValidationPipe(requestWageAccessSchema))
    body: RequestWageAccessDTO,
    @Headers(USER_HEADER) employeeId: string,
  ) {
    await this.wageService.requestWageAccess(employeeId, body);
  }
}
