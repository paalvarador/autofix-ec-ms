import { Test, TestingModule } from '@nestjs/testing';
import { QuotationService } from './quotations.service';

describe('QuotationsService', () => {
  let service: QuotationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuotationService],
    }).compile();

    service = module.get<QuotationService>(QuotationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
