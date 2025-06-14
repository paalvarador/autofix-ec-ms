import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
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

  async findAll() {
    try {
      const quotations = await this.prisma.quotation.findMany({
        select: {
          id: true,
          customerId: true,
          estimatedTime: true,
        },
        orderBy: {
          id: 'asc',
        },
      });

      return quotations;
    } catch (error) {
      if (error instanceof PrismaClientUnknownRequestError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: `Database error: ${error.message}`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        {
          satusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `An unexpected error ocurred ${error}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
