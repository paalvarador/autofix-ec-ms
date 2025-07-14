import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LaborsService } from './labors.service';
import { CreateLaborDto } from './dto/create-labor.dto';
import { UpdateLaborDto } from './dto/update-labor.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('labors')
@ApiTags('labors')
@ApiBearerAuth()
export class LaborsController {
  constructor(private readonly laborsService: LaborsService) {}

  @Post()
  @Roles(UserRole.WORKSHOP, UserRole.ADMIN)
  @ApiOperation({ summary: 'Crear una nueva tarea de mano de obra' })
  @ApiResponse({ status: 201, description: 'Tarea de mano de obra creada exitosamente' })
  @ApiResponse({ status: 403, description: 'Solo talleres y administradores pueden crear tareas' })
  create(@Body() createLaborDto: CreateLaborDto) {
    return this.laborsService.create(createLaborDto);
  }

  @Get()
  @Roles(UserRole.WORKSHOP, UserRole.ADMIN)
  @ApiOperation({ summary: 'Obtener todas las tareas de mano de obra' })
  @ApiResponse({ status: 200, description: 'Lista de tareas obtenida exitosamente' })
  findAll() {
    return this.laborsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.WORKSHOP, UserRole.ADMIN)
  @ApiOperation({ summary: 'Obtener una tarea de mano de obra por ID' })
  @ApiResponse({ status: 200, description: 'Tarea encontrada' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  findOne(@Param('id') id: string) {
    return this.laborsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.WORKSHOP, UserRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar una tarea de mano de obra' })
  @ApiResponse({ status: 200, description: 'Tarea actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  @ApiResponse({ status: 403, description: 'Sin permisos para actualizar tareas' })
  update(@Param('id') id: string, @Body() updateLaborDto: UpdateLaborDto) {
    return this.laborsService.update(id, updateLaborDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar una tarea de mano de obra' })
  @ApiResponse({ status: 200, description: 'Tarea eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  @ApiResponse({ status: 403, description: 'Solo administradores pueden eliminar tareas' })
  remove(@Param('id') id: string) {
    return this.laborsService.remove(id);
  }
}
