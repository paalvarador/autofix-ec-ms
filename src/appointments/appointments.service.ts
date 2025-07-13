import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PrismaService } from '../prisma/prisma.service';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    try {
      // Verificar que la fecha no sea en el pasado
      const appointmentDate = new Date(createAppointmentDto.date);
      const now = new Date();

      if (appointmentDate <= now) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Appointment date must be in the future',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const newAppointment = await this.prisma.appointment.create({
        data: createAppointmentDto,
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
        },
      });

      return newAppointment;
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
              message: 'Invalid customer or workshop ID provided',
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
      const appointments = await this.prisma.appointment.findMany({
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
        },
        orderBy: {
          date: 'asc',
        },
      });

      return appointments;
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
      const appointment = await this.prisma.appointment.findUnique({
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
        },
      });

      if (!appointment) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: `Appointment with ID ${id} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return appointment;
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

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    try {
      const appointment = await this.prisma.appointment.findUnique({
        where: { id },
      });

      if (!appointment) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: `Appointment with ID ${id} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      // Si se está actualizando la fecha, verificar que no sea en el pasado
      if (updateAppointmentDto.date) {
        const appointmentDate = new Date(updateAppointmentDto.date);
        const now = new Date();

        if (appointmentDate <= now) {
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'Appointment date must be in the future',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      const updatedAppointment = await this.prisma.appointment.update({
        where: { id },
        data: updateAppointmentDto,
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
        },
      });

      return updatedAppointment;
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
      const appointment = await this.prisma.appointment.delete({
        where: { id },
        select: {
          id: true,
          date: true,
        },
      });

      if (!appointment) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: `Appointment with ID ${id} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return { message: 'Appointment deleted successfully', ...appointment };
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
      const appointments = await this.prisma.appointment.findMany({
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
        },
        orderBy: {
          date: 'asc',
        },
      });

      return appointments;
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
      const appointments = await this.prisma.appointment.findMany({
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
        },
        orderBy: {
          date: 'asc',
        },
      });

      return appointments;
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

  async findByDateRange(startDate: Date, endDate: Date) {
    try {
      const appointments = await this.prisma.appointment.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
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
        },
        orderBy: {
          date: 'asc',
        },
      });

      return appointments;
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
