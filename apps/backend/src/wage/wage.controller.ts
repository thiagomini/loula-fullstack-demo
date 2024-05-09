import { Controller, Get } from '@nestjs/common';

@Controller('wage')
export class WageController {
  @Get('balance')
  public availableBalance() {}
}
