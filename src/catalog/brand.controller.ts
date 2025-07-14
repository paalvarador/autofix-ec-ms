import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@Controller('brand')
@ApiTags('brands')
@ApiBearerAuth()
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Crear una nueva marca de vehículo' })
  @ApiResponse({ status: 201, description: 'Marca creada exitosamente' })
  @ApiResponse({ status: 403, description: 'Solo administradores pueden crear marcas' })
  async create(@Body() createBrandDto: CreateBrandDto) {
    const vehicleBrand = await this.brandService.create(createBrandDto);

    return {
      message: 'Vehicle brand created successfully',
      vehicleBrand,
    };
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Obtener todas las marcas de vehículos' })
  @ApiResponse({ status: 200, description: 'Lista de marcas obtenida exitosamente' })
  async findAll() {
    return this.brandService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener una marca por ID' })
  @ApiResponse({ status: 200, description: 'Marca encontrada' })
  @ApiResponse({ status: 404, description: 'Marca no encontrada' })
  async findOne(@Param('id') id: string) {
    return this.brandService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar una marca' })
  @ApiResponse({ status: 200, description: 'Marca actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Marca no encontrada' })
  @ApiResponse({ status: 403, description: 'Solo administradores pueden actualizar marcas' })
  update(@Param('id') id: string, @Body() UpdateBrandDto: UpdateBrandDto) {
    return this.brandService.update(id, UpdateBrandDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar una marca' })
  @ApiResponse({ status: 200, description: 'Marca eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Marca no encontrada' })
  @ApiResponse({ status: 403, description: 'Solo administradores pueden eliminar marcas' })
  remove(@Param('id') id: string) {
    return this.brandService.remove(id);
  }
}
