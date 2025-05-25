/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { VehicleBrandService } from './vehicle-brand.service';
import { CreateVehicleBrandDto } from './dto/create-vehicle-brand.dto';
import { UpdateVehicleBrandDto } from './dto/update-vehicle-brand.dto';

@Controller('vehicleBrand')
@ApiTags('vehicleBrands')
export class VehicleBrandController {
  constructor(private readonly vehicleBrandService: VehicleBrandService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new vehicle brand ' })
  async create(@Body() createVehicleBrandDto: CreateVehicleBrandDto) {
    console.log(
      `create controller, createVehicleBrandDto: ${JSON.stringify(createVehicleBrandDto)}`,
    );
    const vehicleBrand = await this.vehicleBrandService.create(
      createVehicleBrandDto,
    );

    console.log(`vehicleBrand: ${JSON.stringify(vehicleBrand)}`);

    return {
      message: 'Vehicle brand created successfully',
      vehicleBrand,
    };
  }

  @Get()
  // @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.vehicleBrandService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.vehicleBrandService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVehicleBrandDto: UpdateVehicleBrandDto,
  ) {
    return this.vehicleBrandService.update(id, updateVehicleBrandDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehicleBrandService.remove(id);
  }
}
