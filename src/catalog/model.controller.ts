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
import { ModelService } from './model.service';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';

@Controller('model')
@ApiTags('model')
export class ModelController {
  constructor(private readonly modelService: ModelService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new vehicle model ' })
  async create(@Body() createModelDto: CreateModelDto) {
    const created = await this.modelService.create(createModelDto);

    return {
      status: HttpStatus.CREATED,
      message: 'Vehicle model created successfully',
      data: created,
    };
  }

  @Get()
  async findAll() {
    const vehicleModels = await this.modelService.findAll();

    return {
      status: HttpStatus.OK,
      message: 'List of vehicle models obtained successfully',
      data: vehicleModels,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const vehicleModel = await this.modelService.findOne(id);
    return {
      status: HttpStatus.OK,
      message: 'Vehicle model obtained successfully',
      data: vehicleModel,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateModelDto: UpdateModelDto,
  ) {
    const vehicleModelUpdated = await this.modelService.update(
      id,
      updateModelDto,
    );
    return {
      status: HttpStatus.OK,
      message: 'Vehicle model updated successfully',
      data: vehicleModelUpdated,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const vehicleModelDeleted = await this.modelService.remove(id);
    return {
      status: HttpStatus.OK,
      message: 'Vehicle model deleted successfully',
      data: vehicleModelDeleted,
    };
  }
}
