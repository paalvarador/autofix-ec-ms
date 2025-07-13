import { PartialType } from '@nestjs/mapped-types';
import { CreateQuotationRequestDto } from './create-quotation-request.dto';

export class UpdateQuotationRequestDto extends PartialType(
  CreateQuotationRequestDto,
) {}
