import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';

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

  async findOne(id: string) {
    try {
      const quotation = await this.prisma.quotation.findUnique({
        where: { id },
        select: {
          id: true,
          customerId: true,
          estimatedTime: true,
        },
      });

      if (!quotation)
        throw new NotFoundException(`Quotation with ID ${id} not found`);

      return quotation;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

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
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An unexpected error ocurred, please try again',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateQuotationDto: UpdateQuotationDto) {
    try {
      // Verificar si la cotizacion existe
      const quotation = await this.prisma.quotation.findUnique({
        where: { id },
      });

      if (!quotation) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: `Quotation with ID ${id} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      // Realizamos la actualizacion
      const updateQuotation = await this.prisma.quotation.update({
        where: { id },
        data: updateQuotationDto,
        select: {
          id: true,
        },
      });

      return updateQuotation;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An unexpected error occurred. Please try again later',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      // Intentamos eliminar la cotizacion
      const quotation = await this.prisma.quotation.delete({
        where: { id },
        select: {
          id: true,
        },
      });

      // Si no se encuentra la cotizacion, se lanza un error 404
      if (!quotation) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: `Quotation with id ${id} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return { message: 'Quotation deleted successfully', ...quotation };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An unexpected error occurred, please try again',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
