import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { WorkshopsService } from './workshops.service';
import { CreateWorkshopDto } from './dto/create-workshop.dto';
import { UpdateWorkshopDto } from './dto/update-workshop.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkshopEntity } from './entities/workshop.entity';

@ApiTags('workshops')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workshops')
export class WorkshopsController {
  constructor(private readonly workshopsService: WorkshopsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new workshop' })
  @ApiResponse({
    status: 201,
    description: 'Workshop created successfully',
    type: WorkshopEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Workshop already exists' })
  create(@Body() createWorkshopDto: CreateWorkshopDto) {
    return this.workshopsService.create(createWorkshopDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all workshops' })
  @ApiResponse({
    status: 200,
    description: 'List of workshops retrieved successfully',
    type: [WorkshopEntity],
  })
  findAll() {
    return this.workshopsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get workshop by ID' })
  @ApiResponse({
    status: 200,
    description: 'Workshop retrieved successfully',
    type: WorkshopEntity,
  })
  @ApiResponse({ status: 404, description: 'Workshop not found' })
  findOne(@Param('id') id: string) {
    return this.workshopsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update workshop by ID' })
  @ApiResponse({
    status: 200,
    description: 'Workshop updated successfully',
    type: WorkshopEntity,
  })
  @ApiResponse({ status: 404, description: 'Workshop not found' })
  update(
    @Param('id') id: string,
    @Body() updateWorkshopDto: UpdateWorkshopDto,
  ) {
    return this.workshopsService.update(id, updateWorkshopDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete workshop by ID' })
  @ApiResponse({ status: 200, description: 'Workshop deleted successfully' })
  @ApiResponse({ status: 404, description: 'Workshop not found' })
  remove(@Param('id') id: string) {
    return this.workshopsService.remove(id);
  }
}
