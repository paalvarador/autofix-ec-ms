import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateQuotationItemDto } from './dto/create-quotation-item.dto';
import { UpdateQuotationItemDto } from './dto/update-quotation-item.dto';
import { PrismaService } from '../prisma/prisma.service';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

@Injectable()
export class QuotationItemsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createQuotationItemDto: CreateQuotationItemDto) {
    try {
      // Validar que la cotización existe
      const quotation = await this.prisma.quotation.findUnique({
        where: { id: createQuotationItemDto.quotationId },
      });

      if (!quotation) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: `Quotation with ID ${createQuotationItemDto.quotationId} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      // Validar que el part existe
      const part = await this.prisma.part.findUnique({
        where: { id: createQuotationItemDto.partId },
      });

      if (!part) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: `Part with ID ${createQuotationItemDto.partId} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      // Si es tipo LABOR, validar que laborTaskId existe
      if (
        createQuotationItemDto.type === 'LABOR' &&
        createQuotationItemDto.laborTaskId
      ) {
        const labor = await this.prisma.labor.findUnique({
          where: { id: createQuotationItemDto.laborTaskId },
        });

        if (!labor) {
          throw new HttpException(
            {
              statusCode: HttpStatus.NOT_FOUND,
              message: `Labor task with ID ${createQuotationItemDto.laborTaskId} not found`,
            },
            HttpStatus.NOT_FOUND,
          );
        }
      }

      const newQuotationItem = await this.prisma.quotationItem.create({
        data: createQuotationItemDto,
        include: {
          quotation: {
            select: {
              id: true,
              total: true,
            },
          },
          part: {
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
            },
          },
          laborTask: {
            select: {
              id: true,
              name: true,
              description: true,
              hourlyRate: true,
              estimatedHours: true,
            },
          },
        },
      });

      return newQuotationItem;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error instanceof PrismaClientValidationError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message:
              'Missing or invalid fields. Ensure all required fields are provided',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'Invalid quotation, part, or labor task ID provided',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An unexpected error occurred.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      const quotationItems = await this.prisma.quotationItem.findMany({
        include: {
          quotation: {
            select: {
              id: true,
              total: true,
              status: true,
            },
          },
          part: {
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
            },
          },
          laborTask: {
            select: {
              id: true,
              name: true,
              description: true,
              hourlyRate: true,
              estimatedHours: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return quotationItems;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
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
          message: `An unexpected error occurred: ${error}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      const quotationItem = await this.prisma.quotationItem.findUnique({
        where: { id },
        include: {
          quotation: {
            select: {
              id: true,
              total: true,
              status: true,
              vehicle: {
                select: {
                  id: true,
                  year: true,
                  licensePlate: true,
                  Model: {
                    select: {
                      id: true,
                      name: true,
                      brand: {
                        select: {
                          id: true,
                          name: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          part: {
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
              stock: true,
            },
          },
          laborTask: {
            select: {
              id: true,
              name: true,
              description: true,
              hourlyRate: true,
              estimatedHours: true,
            },
          },
        },
      });

      if (!quotationItem) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: `Quotation item with ID ${id} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return quotationItem;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error instanceof PrismaClientKnownRequestError) {
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
          message: 'An unexpected error occurred, please try again',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateQuotationItemDto: UpdateQuotationItemDto) {
    try {
      const quotationItem = await this.prisma.quotationItem.findUnique({
        where: { id },
      });

      if (!quotationItem) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: `Quotation item with ID ${id} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const updatedQuotationItem = await this.prisma.quotationItem.update({
        where: { id },
        data: updateQuotationItemDto,
        include: {
          quotation: {
            select: {
              id: true,
              total: true,
              status: true,
            },
          },
          part: {
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
            },
          },
          laborTask: {
            select: {
              id: true,
              name: true,
              description: true,
              hourlyRate: true,
              estimatedHours: true,
            },
          },
        },
      });

      return updatedQuotationItem;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error instanceof PrismaClientKnownRequestError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: `Invalid data provided`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An unexpected error occurred. Please try again later.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      const quotationItem = await this.prisma.quotationItem.delete({
        where: { id },
        select: {
          id: true,
          description: true,
        },
      });

      if (!quotationItem) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: `Quotation item with ID ${id} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        message: 'Quotation item deleted successfully',
        ...quotationItem,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error instanceof PrismaClientKnownRequestError) {
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
          message: 'An unexpected error occurred, please try again',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByQuotation(quotationId: string) {
    try {
      const quotationItems = await this.prisma.quotationItem.findMany({
        where: { quotationId },
        include: {
          part: {
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
              stock: true,
            },
          },
          laborTask: {
            select: {
              id: true,
              name: true,
              description: true,
              hourlyRate: true,
              estimatedHours: true,
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      return quotationItems;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
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
          message: `An unexpected error occurred: ${error}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
