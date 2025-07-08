import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePartDto } from './dto/create-part.dto';
import { UpdatePartDto } from './dto/update-part.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class PartsService {
  constructor(private prisma: PrismaService) {}

  async create(createPartDto: CreatePartDto) {
    const { workshopId } = createPartDto;

    // Verificar si existe el worshop (taller)
    const workshop = await this.prisma.part.findUnique({
      where: { id: workshopId },
    });

    if (!workshop) {
      throw new BadRequestException(
        `The workshop with ID ${workshopId} does not exist`,
      );
    }

    try {
      const workshop = this.prisma.part.create({
        data: createPartDto,
        select: { id: true },
      });

      return workshop;
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
      const parts = await this.prisma.part.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
        },
        orderBy: {
          id: 'asc',
        },
      });

      return parts;
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

  async findOne(id: string) {
    try {
      const part = await this.prisma.part.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
        },
      });

      if (!part) {
        throw new NotFoundException(`Part with ID ${id} not found`);
      }

      return part;
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
          message: 'An unexpected error occurred, please try again',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updatePartDto: UpdatePartDto) {
    const part = await this.prisma.part.findUnique({
      where: { id },
    });

    if (!part) {
      throw new NotFoundException(`Part with ID ${id} not found`);
    }

    try {
      const updatePart = await this.prisma.part.update({
        where: { id },
        data: updatePartDto,
        select: {
          id: true,
        },
      });

      return updatePart;
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
      const part = await this.prisma.part.delete({
        where: { id },
        select: {
          id: true,
        },
      });

      if (!part) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: `Part with id ${id} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return { message: 'Part deleted successfully', ...part };
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
