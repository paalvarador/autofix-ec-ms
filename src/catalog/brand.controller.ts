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
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Controller('brand')
@ApiTags('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new vehicle brand ' })
  async create(@Body() createBrandDto: CreateBrandDto) {
    console.log(
      `create controller, createVehicleBrandDto: ${JSON.stringify(createBrandDto)}`,
    );
    const vehicleBrand = await this.brandService.create(createBrandDto);

    console.log(`vehicleBrand: ${JSON.stringify(vehicleBrand)}`);

    return {
      message: 'Vehicle brand created successfully',
      vehicleBrand,
    };
  }

  @Get()
  // @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.brandService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.brandService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() UpdateBrandDto: UpdateBrandDto) {
    return this.brandService.update(id, UpdateBrandDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandService.remove(id);
  }
}
