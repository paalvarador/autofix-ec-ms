import { Controller } from '@nestjs/common';
import { QuotationService } from './quotations.service';

@Controller('quotations')
export class QuotationsController {
  constructor(private readonly quotationsService: QuotationService) {}
}
