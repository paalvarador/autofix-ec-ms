/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { VehicleModelService } from './vehicle-model.service';
import { CreateVehicleModelDto } from './dto/create-vehicle-model.dto';
import { UpdateVehicleModelDto } from './dto/update-vehicle-model.dto';

@Controller('vehicleModel')
@ApiTags('vehicleModel')
export class VehicleModelController {
  constructor(private readonly vehicleModelService: VehicleModelService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new vehicle model ' })
  async create(@Body() createVehicleModelDto: CreateVehicleModelDto) {
    const created = await this.vehicleModelService.create(
      createVehicleModelDto,
    );

    return {
      status: HttpStatus.CREATED,
      message: 'Vehicle model created successfully',
      data: created,
    };
  }

  @Get()
  async findAll() {
    const vehicleModels = await this.vehicleModelService.findAll();

    return {
      status: HttpStatus.OK,
      message: 'List of vehicle models obtained successfully',
      data: vehicleModels,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const vehicleModel = await this.vehicleModelService.findOne(id);
    return {
      status: HttpStatus.OK,
      message: 'Vehicle model obtained successfully',
      data: vehicleModel,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateVehicleModelDto: UpdateVehicleModelDto,
  ) {
    const vehicleModelUpdated = await this.vehicleModelService.update(
      id,
      updateVehicleModelDto,
    );
    return {
      status: HttpStatus.OK,
      message: 'Vehicle model updated successfully',
      data: vehicleModelUpdated,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const vehicleModelDeleted = await this.vehicleModelService.remove(id);
    return {
      status: HttpStatus.OK,
      message: 'Vehicle model deleted successfully',
      data: vehicleModelDeleted,
    };
  }
}
