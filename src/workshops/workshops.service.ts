import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateWorkshopDto } from './dto/create-workshop.dto';
import { UpdateWorkshopDto } from './dto/update-workshop.dto';
import { PrismaService } from '../prisma/prisma.service';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

@Injectable()
export class WorkshopsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createWorkshopDto: CreateWorkshopDto) {
    try {
      const existingWorkshop = await this.prisma.workshop.findUnique({
        where: {
          email: createWorkshopDto.email,
        },
      });

      if (existingWorkshop) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            message: `A workshop with the email ${createWorkshopDto.email} already exists`,
          },
          HttpStatus.CONFLICT,
        );
      }

      const newWorkshop = await this.prisma.workshop.create({
        data: createWorkshopDto,
      });

      return newWorkshop;
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
        if (
          error.code === 'P2002' &&
          Array.isArray(error.meta?.target) &&
          (error.meta.target as string[]).includes('email')
        ) {
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              message: `Email must be unique. The email ${createWorkshopDto.email} already exists.`,
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
      const workshops = await this.prisma.workshop.findMany({
        include: {
          users: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
            },
          },
        },
      });

      return workshops;
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
      const workshop = await this.prisma.workshop.findUnique({
        where: { id },
        include: {
          users: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
            },
          },
          Part: true,
          LaborTask: true,
        },
      });

      if (!workshop) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: `Workshop with ID ${id} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return workshop;
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

  async update(id: string, updateWorkshopDto: UpdateWorkshopDto) {
    try {
      const workshop = await this.prisma.workshop.findUnique({
        where: { id },
      });

      if (!workshop) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: `Workshop with ID ${id} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const updatedWorkshop = await this.prisma.workshop.update({
        where: { id },
        data: updateWorkshopDto,
      });

      return updatedWorkshop;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error instanceof PrismaClientKnownRequestError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: `Workshop with this email already exists`,
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
      const workshop = await this.prisma.workshop.delete({
        where: { id },
        select: {
          id: true,
          name: true,
        },
      });

      if (!workshop) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: `Workshop with ID ${id} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return { message: 'Workshop deleted successfully', ...workshop };
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
}
