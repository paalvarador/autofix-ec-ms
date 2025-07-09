import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLaborDto } from './dto/create-labor.dto';
import { UpdateLaborDto } from './dto/update-labor.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class LaborsService {
  constructor(private prisma: PrismaService) {}

  async create(createLaborDto: CreateLaborDto) {
    const { workshopId } = createLaborDto;

    // Verificar que el workshopId existe
    const workshop = await this.prisma.labor.findUnique({
      where: { id: workshopId },
    });

    if (!workshop) {
      throw new BadRequestException(
        `The workshop with ID ${workshopId} does not exist`,
      );
    }

    try {
      const labor = this.prisma.labor.create({
        data: createLaborDto,
        select: { id: true },
      });

      return labor;
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
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `An unexpected error occurred ${error}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      const labors = await this.prisma.labor.findMany({
        select: {
          id: true,
          name: true,
          description: true,
        },
        orderBy: {
          id: 'asc',
        },
      });

      return labors;
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
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `An unexpected error occurred: ${error}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      const labor = await this.prisma.labor.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          description: true,
        },
      });

      if (!labor) {
        throw new NotFoundException(`Labor with ID ${id} not found`);
      }

      return labor;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error instanceof PrismaClientUnknownRequestError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: `Database error ${error.message}`,
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

  async update(id: string, updateLaborDto: UpdateLaborDto) {
    try {
      const labor = await this.prisma.labor.findUnique({
        where: { id },
      });

      if (!labor) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: `Labor with ID ${id} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const updateLabor = await this.prisma.labor.update({
        where: { id },
        data: updateLaborDto,
        select: {
          id: true,
        },
      });

      return updateLabor;
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
      // Intentamos eliminar la Labor
      const labor = await this.prisma.labor.delete({
        where: { id },
        select: {
          id: true,
        },
      });

      if (!labor) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: `Labor with id ${id} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return { message: 'Labor deleted successfully', ...labor };
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
