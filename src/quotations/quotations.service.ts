import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuotationDto } from './dto/create-quotation.dto';

@Injectable()
export class QuotationService {
  constructor(private prisma: PrismaService) {}

  async create(createQuotation: CreateQuotationDto) {
    try {
      const quotation = this.prisma.quotation.create({
        data: createQuotation,
        select: { id: true },
      });

      return quotation;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          StatusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An unexpected error ocurred.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
