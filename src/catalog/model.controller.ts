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
import { ApiOperation, ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ModelService } from './model.service';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@Controller('model')
@ApiTags('model')
@ApiBearerAuth()
export class ModelController {
  constructor(private readonly modelService: ModelService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Crear un nuevo modelo de vehículo' })
  @ApiResponse({ status: 201, description: 'Modelo creado exitosamente' })
  @ApiResponse({ status: 403, description: 'Solo administradores pueden crear modelos' })
  async create(@Body() createModelDto: CreateModelDto) {
    const created = await this.modelService.create(createModelDto);

    return {
      status: HttpStatus.CREATED,
      message: 'Vehicle model created successfully',
      data: created,
    };
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Obtener todos los modelos de vehículos' })
  @ApiResponse({ status: 200, description: 'Lista de modelos obtenida exitosamente' })
  async findAll() {
    const vehicleModels = await this.modelService.findAll();

    return {
      status: HttpStatus.OK,
      message: 'List of vehicle models obtained successfully',
      data: vehicleModels,
    };
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un modelo por ID' })
  @ApiResponse({ status: 200, description: 'Modelo encontrado' })
  @ApiResponse({ status: 404, description: 'Modelo no encontrado' })
  async findOne(@Param('id') id: string) {
    const vehicleModel = await this.modelService.findOne(id);
    return {
      status: HttpStatus.OK,
      message: 'Vehicle model obtained successfully',
      data: vehicleModel,
    };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar un modelo' })
  @ApiResponse({ status: 200, description: 'Modelo actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Modelo no encontrado' })
  @ApiResponse({ status: 403, description: 'Solo administradores pueden actualizar modelos' })
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
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar un modelo' })
  @ApiResponse({ status: 200, description: 'Modelo eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Modelo no encontrado' })
  @ApiResponse({ status: 403, description: 'Solo administradores pueden eliminar modelos' })
  async remove(@Param('id') id: string) {
    const vehicleModelDeleted = await this.modelService.remove(id);
    return {
      status: HttpStatus.OK,
      message: 'Vehicle model deleted successfully',
      data: vehicleModelDeleted,
    };
  }
}
