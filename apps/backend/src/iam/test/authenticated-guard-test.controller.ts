import { Controller, Get } from '@nestjs/common';
import { Public } from '../public.decorator';

@Controller('test')
export class AuthenticatedGuardTestController {
  @Get('protected')
  public protected() {}

  @Get('unprotected')
  @Public()
  public unprotected() {}
}
