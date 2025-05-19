import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CreateVehicleBrandDto } from './dto/create-vehicle-brand.dto';
import { CreateVehicleModelDto } from './dto/create-vehicle-model.dto';
import { UpdateVehicleBrandDto } from './dto/update-vehicle-brand.dto';
import { UpdateVehicleModelDto } from './dto/update-vehicle-model.dto';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Post()
  createVehicleBrand(@Body() createVehicleBrand: CreateVehicleBrandDto) {
    return this.catalogService.createVehicleBrand(createVehicleBrand);
  }

  @Post()
  createVehicleModel(@Body() createVehicleModel: CreateVehicleModelDto) {
    return this.catalogService.createVehicleModel(createVehicleModel);
  }

  @Get()
  findAll() {
    return this.catalogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catalogService.findOne(+id);
  }

  @Patch(':id')
  updateVehicleBrand(
    @Param('id') id: string,
    @Body() updateVehicleBrand: UpdateVehicleBrandDto,
  ) {
    return this.catalogService.updateVehicleBrand(+id, updateVehicleBrand);
  }

  @Patch('id')
  updateVehicleModel(
    @Param('id') id: string,
    @Body() updateVehicleModel: UpdateVehicleModelDto,
  ) {
    return this.catalogService.updateVehicleModel(+id, updateVehicleModel);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.catalogService.remove(+id);
  }
}
