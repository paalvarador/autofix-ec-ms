import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuotationDto } from './dto/create-quotation.dto';

@Injectable()
export class QuotationService {
  constructor(private prisma: PrismaService) {}

  async create(createQuotation: CreateQuotationDto) {
    try {
      console.log(`Aqui vamos a hacer el guardado de la informacion`);
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
