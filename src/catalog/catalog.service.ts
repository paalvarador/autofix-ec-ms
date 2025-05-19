import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVehicleBrandDto } from './dto/create-vehicle-brand.dto';
import { CreateVehicleModelDto } from './dto/create-vehicle-model.dto';
import { UpdateVehicleBrandDto } from './dto/update-vehicle-brand.dto';
import { UpdateVehicleModelDto } from './dto/update-vehicle-model.dto';

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

  async createVehicleBrand(createVehicleBrand: CreateVehicleBrandDto) {}

  async createVehicleModel(createVehicleModel: CreateVehicleModelDto) {}

  findAll() {
    return `This action returns all catalog`;
  }

  findOne(id: number) {
    return `This action returns a #${id} catalog`;
  }

  async updateVehicleBrand(
    id: number,
    updateVehicleBrand: UpdateVehicleBrandDto,
  ) {}

  async updateVehicleModel(
    id: number,
    updateVehicleModel: UpdateVehicleModelDto,
  ) {}

  remove(id: number) {
    return `This action removes a #${id} catalog`;
  }
}
