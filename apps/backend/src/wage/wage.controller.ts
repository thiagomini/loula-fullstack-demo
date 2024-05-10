import { Controller, Get, Headers, Query } from '@nestjs/common';
import { USER_HEADER } from '../iam/headers';
import { ZodValidationPipe } from '../utils/zod-validation.pipe';
import { WageService } from './application/wage.service';
import { currencySchema } from './currency.validation';
import { Currency } from './domain/currency';

@Controller('wage')
export class WageController {
  constructor(private readonly wageService: WageService) {}

  @Get('balance')
  public async availableBalance(
    @Query('currency', new ZodValidationPipe(currencySchema))
    requestedCurrency: string,
    @Headers(USER_HEADER) userId?: string,
  ) {
    const employeeId = userId;

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
}
