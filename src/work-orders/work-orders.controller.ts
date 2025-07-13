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
import { WorkOrdersService } from './work-orders.service';
import { CreateWorkOrderDto } from './dto/create-work-order.dto';
import { UpdateWorkOrderDto } from './dto/update-work-order.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkOrderEntity } from './entities/work-order.entity';

@ApiTags('work-orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('work-orders')
export class WorkOrdersController {
  constructor(private readonly workOrdersService: WorkOrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new work order from accepted quotation' })
  @ApiResponse({
    status: 201,
    description: 'Work order created successfully',
    type: WorkOrderEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Quotation not found' })
  @ApiResponse({
    status: 409,
    description: 'Work order already exists for this quotation',
  })
  create(@Body() createWorkOrderDto: CreateWorkOrderDto) {
    return this.workOrdersService.create(createWorkOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all work orders' })
  @ApiResponse({
    status: 200,
    description: 'List of work orders retrieved successfully',
    type: [WorkOrderEntity],
  })
  findAll() {
    return this.workOrdersService.findAll();
  }

  @Get('by-workshop/:workshopId')
  @ApiOperation({ summary: 'Get work orders by workshop ID' })
  @ApiResponse({
    status: 200,
    description: 'List of work orders for workshop retrieved successfully',
    type: [WorkOrderEntity],
  })
  findByWorkshop(@Param('workshopId') workshopId: string) {
    return this.workOrdersService.findByWorkshop(workshopId);
  }

  @Get('by-customer/:customerId')
  @ApiOperation({ summary: 'Get work orders by customer ID' })
  @ApiResponse({
    status: 200,
    description: 'List of work orders for customer retrieved successfully',
    type: [WorkOrderEntity],
  })
  findByCustomer(@Param('customerId') customerId: string) {
    return this.workOrdersService.findByCustomer(customerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get work order by ID' })
  @ApiResponse({
    status: 200,
    description: 'Work order retrieved successfully',
    type: WorkOrderEntity,
  })
  @ApiResponse({ status: 404, description: 'Work order not found' })
  findOne(@Param('id') id: string) {
    return this.workOrdersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update work order by ID' })
  @ApiResponse({
    status: 200,
    description: 'Work order updated successfully',
    type: WorkOrderEntity,
  })
  @ApiResponse({ status: 404, description: 'Work order not found' })
  update(
    @Param('id') id: string,
    @Body() updateWorkOrderDto: UpdateWorkOrderDto,
  ) {
    return this.workOrdersService.update(id, updateWorkOrderDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete work order by ID' })
  @ApiResponse({ status: 200, description: 'Work order deleted successfully' })
  @ApiResponse({ status: 404, description: 'Work order not found' })
  remove(@Param('id') id: string) {
    return this.workOrdersService.remove(id);
  }
}
