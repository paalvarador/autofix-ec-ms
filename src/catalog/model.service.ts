/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateModelDto } from './dto/create-model.dto';
import {
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { UpdateModelDto } from './dto/update-model.dto';

@Injectable()
export class ModelService {
  constructor(private prisma: PrismaService) {}

  async create(createModelDto: CreateModelDto) {
    try {
      const name = createModelDto.name;
      const existingModel = await this.prisma.model.findFirst({
        where: {
          name: name,
        },
      });

      console.log(`existingModel: ${JSON.stringify(existingModel)}`);

      if (existingModel) {
        throw new ConflictException(
          `There is a vehicle model with the name ${name}`,
        );
      }

      const newModel = this.prisma.model.create({
        data: createModelDto,
        select: { id: true, name: true },
      });

      return newModel;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException(
          `Missing or invalid fields. Ensure all required fields are provided`,
        );
      }

      throw new InternalServerErrorException(`An unexpected error occurred`);
    }
  }

  async findAll() {
    try {
      const models = await this.prisma.model.findMany({
        select: {
          id: true,
          name: true,
          brand: true,
        },
        orderBy: {
          name: 'asc',
        },
      });

      return models;
    } catch (error) {
      if (error instanceof PrismaClientUnknownRequestError) {
        throw new BadRequestException(`Database error: ${error.message}`);
      }
      throw new InternalServerErrorException(
        `An unexpected error ocurred: ${error}`,
      );
    }
  }

  async findOne(id: string) {
    try {
      const model = await this.prisma.model.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          brand: true,
        },
      });

      if (!model) {
        throw new NotFoundException(`Model with ID ${id} not found`);
      }

      return model;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error instanceof PrismaClientUnknownRequestError) {
        throw new BadRequestException(`Database error: ${error.message}`);
      }

      throw new InternalServerErrorException(
        `An unexpected error ocurred, please try again`,
      );
    }
  }

  async update(id: string, updateModelDto: UpdateModelDto) {
    try {
      const model = await this.prisma.model.findUnique({
        where: { id },
      });

      if (!model) {
        throw new NotFoundException(`Model with ID ${id} not found`);
      }

      const updateModel = await this.prisma.model.update({
        where: { id },
        data: updateModelDto,
        select: {
          id: true,
          name: true,
          brand: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      console.log(`updateModel: ${JSON.stringify(updateModel)}`);

      return updateModel;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error instanceof PrismaClientUnknownRequestError) {
        throw new ConflictException(`Model already exists`);
      }

      throw new InternalServerErrorException(
        `An unexpected error occurred: ${error}`,
      );
    }
  }

  async remove(id: string) {
    try {
      const model = await this.prisma.model.findUnique({
        where: { id },
      });

      if (!model) {
        throw new NotFoundException(`Model with ID ${id} not found`);
      }

      const deleteModel = await this.prisma.model.delete({
        where: { id },
        select: {
          id: true,
          name: true,
        },
      });

      return deleteModel;
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
