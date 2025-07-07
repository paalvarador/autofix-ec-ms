import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  async create(createVehicleDto: CreateVehicleDto) {
    const { ownerId, modelId } = createVehicleDto;

    // Verificar si el owner (usuario) existe
    const owner = await this.prisma.user.findUnique({ where: { id: ownerId } });
    if (!owner) {
      throw new BadRequestException(
        `The user with ID ${ownerId} does not exist`,
      );
    }

    // Verificar si el modelo del vehiculo existe
    const model = await this.prisma.model.findUnique({
      where: { id: modelId },
    });
    if (!model) {
      throw new BadRequestException(
        `The model with ID ${modelId} does not exist`,
      );
    }

    try {
      const vehicle = this.prisma.vehicle.create({
        data: createVehicleDto,
        select: { id: true },
      });

      return vehicle;
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
      const vehicles = await this.prisma.vehicle.findMany({
        select: {
          id: true,
          licensePlate: true,
        },
        orderBy: {
          id: 'asc',
        },
      });

      return vehicles;
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
      const vehicle = await this.prisma.vehicle.findUnique({
        where: { id },
        select: {
          id: true,
          licensePlate: true,
        },
      });

      if (!vehicle) {
        throw new NotFoundException(`Vehicle with ID ${id} not found`);
      }

      return vehicle;
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

  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    try {
      // Verificamos si el vehiculo existe
      const vehicle = await this.prisma.vehicle.findUnique({
        where: { id },
      });

      if (!vehicle) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: `Vehicle with ID ${id} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const updateVehicle = await this.prisma.vehicle.update({
        where: { id },
        data: updateVehicleDto,
        select: {
          id: true,
        },
      });

      return updateVehicle;
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
      // Intentamos eliminar el vehiculo
      const vehicle = await this.prisma.vehicle.delete({
        where: { id },
        select: {
          id: true,
        },
      });

      if (!vehicle) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: `Vehicle with id ${id} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return { message: 'Vehicle deleted successfully', ...vehicle };
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
