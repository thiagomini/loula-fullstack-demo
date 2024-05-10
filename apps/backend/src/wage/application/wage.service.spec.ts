import { Test, TestingModule } from '@nestjs/testing';
import { WageService } from './wage.service';

describe('WageService', () => {
  let service: WageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WageService],
    }).compile();

    service = module.get<WageService>(WageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
