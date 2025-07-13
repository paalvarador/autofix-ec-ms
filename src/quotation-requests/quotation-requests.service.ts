import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateQuotationRequestDto } from './dto/create-quotation-request.dto';
import { UpdateQuotationRequestDto } from './dto/update-quotation-request.dto';
import { PrismaService } from '../prisma/prisma.service';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

@Injectable()
export class QuotationRequestsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createQuotationRequestDto: CreateQuotationRequestDto) {
    try {
      const newQuotationRequest = await this.prisma.quotationRequest.create({
        data: createQuotationRequestDto,
        include: {
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          vehicle: {
            select: {
              id: true,
              year: true,
              licensePlate: true,
              color: true,
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
          workshop: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return newQuotationRequest;
    } catch (error) {
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
              message: 'Invalid customer, vehicle, or workshop ID provided',
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
      const quotationRequests = await this.prisma.quotationRequest.findMany({
        include: {
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          vehicle: {
            select: {
              id: true,
              year: true,
              licensePlate: true,
              color: true,
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
          workshop: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return quotationRequests;
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
      const quotationRequest = await this.prisma.quotationRequest.findUnique({
        where: { id },
        include: {
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          vehicle: {
            select: {
              id: true,
              year: true,
              licensePlate: true,
              color: true,
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
          workshop: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              address: true,
            },
          },
        },
      });

      if (!quotationRequest) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: `Quotation request with ID ${id} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return quotationRequest;
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

  async update(
    id: string,
    updateQuotationRequestDto: UpdateQuotationRequestDto,
  ) {
    try {
      const quotationRequest = await this.prisma.quotationRequest.findUnique({
        where: { id },
      });

      if (!quotationRequest) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: `Quotation request with ID ${id} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const updatedQuotationRequest = await this.prisma.quotationRequest.update(
        {
          where: { id },
          data: updateQuotationRequestDto,
          include: {
            customer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            vehicle: {
              select: {
                id: true,
                year: true,
                licensePlate: true,
                color: true,
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
            workshop: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      );

      return updatedQuotationRequest;
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
      const quotationRequest = await this.prisma.quotationRequest.delete({
        where: { id },
        select: {
          id: true,
          description: true,
        },
      });

      if (!quotationRequest) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: `Quotation request with ID ${id} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        message: 'Quotation request deleted successfully',
        ...quotationRequest,
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

  async findByCustomer(customerId: string) {
    try {
      const quotationRequests = await this.prisma.quotationRequest.findMany({
        where: { customerId },
        include: {
          vehicle: {
            select: {
              id: true,
              year: true,
              licensePlate: true,
              color: true,
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
          workshop: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return quotationRequests;
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

  async findByWorkshop(workshopId: string) {
    try {
      const quotationRequests = await this.prisma.quotationRequest.findMany({
        where: { workshopId },
        include: {
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          vehicle: {
            select: {
              id: true,
              year: true,
              licensePlate: true,
              color: true,
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
        orderBy: {
          createdAt: 'desc',
        },
      });

      return quotationRequests;
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
