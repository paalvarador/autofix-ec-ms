import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AppointmentEntity } from './entities/appointment.entity';

@ApiTags('appointments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiResponse({
    status: 201,
    description: 'Appointment created successfully',
    type: AppointmentEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all appointments' })
  @ApiResponse({
    status: 200,
    description: 'List of appointments retrieved successfully',
    type: [AppointmentEntity],
  })
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Get('by-customer/:customerId')
  @ApiOperation({ summary: 'Get appointments by customer ID' })
  @ApiResponse({
    status: 200,
    description: 'List of appointments for customer retrieved successfully',
    type: [AppointmentEntity],
  })
  findByCustomer(@Param('customerId') customerId: string) {
    return this.appointmentsService.findByCustomer(customerId);
  }

  @Get('by-workshop/:workshopId')
  @ApiOperation({ summary: 'Get appointments by workshop ID' })
  @ApiResponse({
    status: 200,
    description: 'List of appointments for workshop retrieved successfully',
    type: [AppointmentEntity],
  })
  findByWorkshop(@Param('workshopId') workshopId: string) {
    return this.appointmentsService.findByWorkshop(workshopId);
  }

  @Get('by-date-range')
  @ApiOperation({ summary: 'Get appointments by date range' })
  @ApiQuery({
    name: 'startDate',
    description: 'Start date (ISO format)',
    required: true,
  })
  @ApiQuery({
    name: 'endDate',
    description: 'End date (ISO format)',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'List of appointments in date range retrieved successfully',
    type: [AppointmentEntity],
  })
  findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.appointmentsService.findByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get appointment by ID' })
  @ApiResponse({
    status: 200,
    description: 'Appointment retrieved successfully',
    type: AppointmentEntity,
  })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update appointment by ID' })
  @ApiResponse({
    status: 200,
    description: 'Appointment updated successfully',
    type: AppointmentEntity,
  })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete appointment by ID' })
  @ApiResponse({ status: 200, description: 'Appointment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(id);
  }
}
