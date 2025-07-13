import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateWorkOrderDto } from './dto/create-work-order.dto';
import { UpdateWorkOrderDto } from './dto/update-work-order.dto';
import { PrismaService } from '../prisma/prisma.service';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

@Injectable()
export class WorkOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createWorkOrderDto: CreateWorkOrderDto) {
    try {
      // Verificar que la cotización existe y está aceptada
      const quotation = await this.prisma.quotation.findUnique({
        where: { id: createWorkOrderDto.quotationId },
      });

      if (!quotation) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: `Quotation with ID ${createWorkOrderDto.quotationId} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      if (quotation.status !== 'ACCEPTED') {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message:
              'Cannot create work order for a quotation that is not accepted',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Verificar que no existe ya una orden de trabajo para esta cotización
      const existingWorkOrder = await this.prisma.workOrder.findUnique({
        where: { quotationId: createWorkOrderDto.quotationId },
      });

      if (existingWorkOrder) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            message: `Work order already exists for quotation ${createWorkOrderDto.quotationId}`,
          },
          HttpStatus.CONFLICT,
        );
      }

      const newWorkOrder = await this.prisma.workOrder.create({
        data: createWorkOrderDto,
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
          workshop: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              address: true,
            },
          },
          quotation: {
            select: {
              id: true,
              total: true,
              estimatedTime: true,
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
              items: {
                select: {
                  id: true,
                  description: true,
                  type: true,
                  price: true,
                  part: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                  laborTask: {
                    select: {
                      id: true,
                      name: true,
                      hourlyRate: true,
                      estimatedHours: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return newWorkOrder;
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
              message: 'Invalid quotation, workshop, or customer ID provided',
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
      const workOrders = await this.prisma.workOrder.findMany({
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
          workshop: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          quotation: {
            select: {
              id: true,
              total: true,
              estimatedTime: true,
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
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return workOrders;
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
      const workOrder = await this.prisma.workOrder.findUnique({
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
          workshop: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              address: true,
            },
          },
          quotation: {
            select: {
              id: true,
              total: true,
              estimatedTime: true,
              status: true,
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
              items: {
                select: {
                  id: true,
                  description: true,
                  type: true,
                  price: true,
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
              },
            },
          },
        },
      });

      if (!workOrder) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: `Work order with ID ${id} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return workOrder;
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

  async update(id: string, updateWorkOrderDto: UpdateWorkOrderDto) {
    try {
      const workOrder = await this.prisma.workOrder.findUnique({
        where: { id },
      });

      if (!workOrder) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: `Work order with ID ${id} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const updatedWorkOrder = await this.prisma.workOrder.update({
        where: { id },
        data: updateWorkOrderDto,
        include: {
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          workshop: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          quotation: {
            select: {
              id: true,
              total: true,
              estimatedTime: true,
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
          },
        },
      });

      return updatedWorkOrder;
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
      const workOrder = await this.prisma.workOrder.delete({
        where: { id },
        select: {
          id: true,
          quotationId: true,
        },
      });

      if (!workOrder) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: `Work order with ID ${id} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return { message: 'Work order deleted successfully', ...workOrder };
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

  async findByWorkshop(workshopId: string) {
    try {
      const workOrders = await this.prisma.workOrder.findMany({
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
          quotation: {
            select: {
              id: true,
              total: true,
              estimatedTime: true,
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
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return workOrders;
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

  async findByCustomer(customerId: string) {
    try {
      const workOrders = await this.prisma.workOrder.findMany({
        where: { customerId },
        include: {
          workshop: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              address: true,
            },
          },
          quotation: {
            select: {
              id: true,
              total: true,
              estimatedTime: true,
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
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return workOrders;
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
