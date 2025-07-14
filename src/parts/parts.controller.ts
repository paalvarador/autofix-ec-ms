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
import { PartsService } from './parts.service';
import { CreatePartDto } from './dto/create-part.dto';
import { UpdatePartDto } from './dto/update-part.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('parts')
@ApiTags('parts')
@ApiBearerAuth()
export class PartsController {
  constructor(private readonly partsService: PartsService) {}

  @Post()
  @Roles(UserRole.WORKSHOP, UserRole.ADMIN)
  @ApiOperation({ summary: 'Crear una nueva parte/repuesto' })
  @ApiResponse({ status: 201, description: 'Parte creada exitosamente' })
  @ApiResponse({ status: 403, description: 'Solo talleres y administradores pueden crear partes' })
  create(@Body() createPartDto: CreatePartDto) {
    return this.partsService.create(createPartDto);
  }

  @Get()
  @Roles(UserRole.WORKSHOP, UserRole.ADMIN)
  @ApiOperation({ summary: 'Obtener todas las partes/repuestos' })
  @ApiResponse({ status: 200, description: 'Lista de partes obtenida exitosamente' })
  findAll() {
    return this.partsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.WORKSHOP, UserRole.ADMIN)
  @ApiOperation({ summary: 'Obtener una parte por ID' })
  @ApiResponse({ status: 200, description: 'Parte encontrada' })
  @ApiResponse({ status: 404, description: 'Parte no encontrada' })
  findOne(@Param('id') id: string) {
    return this.partsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.WORKSHOP, UserRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar una parte' })
  @ApiResponse({ status: 200, description: 'Parte actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Parte no encontrada' })
  @ApiResponse({ status: 403, description: 'Sin permisos para actualizar partes' })
  update(@Param('id') id: string, @Body() updatePartDto: UpdatePartDto) {
    return this.partsService.update(id, updatePartDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar una parte' })
  @ApiResponse({ status: 200, description: 'Parte eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Parte no encontrada' })
  @ApiResponse({ status: 403, description: 'Solo administradores pueden eliminar partes' })
  remove(@Param('id') id: string) {
    return this.partsService.remove(id);
  }
}
