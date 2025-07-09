import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LaborsService } from './labors.service';
import { CreateLaborDto } from './dto/create-labor.dto';
import { UpdateLaborDto } from './dto/update-labor.dto';

@Controller('labors')
export class LaborsController {
  constructor(private readonly laborsService: LaborsService) {}

  @Post()
  create(@Body() createLaborDto: CreateLaborDto) {
    return this.laborsService.create(createLaborDto);
  }

  @Get()
  findAll() {
    return this.laborsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.laborsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLaborDto: UpdateLaborDto) {
    return this.laborsService.update(+id, updateLaborDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.laborsService.remove(+id);
  }
}
