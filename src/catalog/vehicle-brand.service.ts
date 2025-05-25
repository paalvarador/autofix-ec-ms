/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVehicleBrandDto } from './dto/create-vehicle-brand.dto';
import {
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { UpdateVehicleBrandDto } from './dto/update-vehicle-brand.dto';

@Injectable()
export class VehicleBrandService {
  constructor(private prisma: PrismaService) {}

  async create(createVehicleBrand: CreateVehicleBrandDto) {
    try {
      const name = createVehicleBrand.name;
      const existingBrand = await this.prisma.vehicleBrand.findUnique({
        where: {
          name: name,
        },
      });

      console.log(`existingBrand: ${JSON.stringify(existingBrand)}`);

      if (existingBrand) {
        throw new ConflictException(
          `Ya existe una marca con el nombre ${name}`,
        );
      }

      const newBrand = this.prisma.vehicleBrand.create({
        data: createVehicleBrand,
        select: { id: true },
      });

      return newBrand;
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

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An unexpected error ocurred.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      const brands = await this.prisma.vehicleBrand.findMany({
        select: {
          id: true,
          name: true,
        },
      });

      return brands;
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
      const brand = await this.prisma.vehicleBrand.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
        },
      });

      console.log(`findOne brand: ${JSON.stringify(brand)}`);

      if (!brand) {
        throw new NotFoundException(`brand wit ID ${id} not found`);
      }

      return brand;
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

  async update(id: string, updateVehicleBrandDto: UpdateVehicleBrandDto) {
    try {
      const brand = await this.prisma.vehicleBrand.findUnique({
        where: { id },
      });

      if (!brand) {
        throw new NotFoundException(`Brand with ID ${id} not found`);
      }

      const updateBrand = await this.prisma.vehicleBrand.update({
        where: { id },
        data: updateVehicleBrandDto,
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      console.log(`updatedBrand: ${updateBrand}`);

      return updateBrand;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error instanceof PrismaClientUnknownRequestError) {
        throw new ConflictException(`Brand already exists`);
      }

      throw new InternalServerErrorException(`An unexpectexd error occurred`);
    }
  }

  async remove(id: string) {
    try {
      console.log(`Entra en el try del remove`);
      const brand = await this.prisma.vehicleBrand.delete({
        where: { id },
        select: {
          id: true,
        },
      });

      console.log(`remove brand: ${JSON.stringify(brand)}`);

      if (!brand) {
        throw new NotFoundException(`brand with ID ${id} not found`);
      }

      return { message: 'Brand deleted successfully', ...brand };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error instanceof PrismaClientUnknownRequestError) {
        throw new BadRequestException(`Database error: ${error.message}`);
      }

      throw new InternalServerErrorException(
        `An unexpected error occurred, please try again`,
      );
    }
  }
}
