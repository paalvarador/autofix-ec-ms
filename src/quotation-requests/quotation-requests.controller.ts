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
import { QuotationRequestsService } from './quotation-requests.service';
import { CreateQuotationRequestDto } from './dto/create-quotation-request.dto';
import { UpdateQuotationRequestDto } from './dto/update-quotation-request.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QuotationRequestEntity } from './entities/quotation-request.entity';

@ApiTags('quotation-requests')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('quotation-requests')
export class QuotationRequestsController {
  constructor(
    private readonly quotationRequestsService: QuotationRequestsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new quotation request' })
  @ApiResponse({
    status: 201,
    description: 'Quotation request created successfully',
    type: QuotationRequestEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createQuotationRequestDto: CreateQuotationRequestDto) {
    return this.quotationRequestsService.create(createQuotationRequestDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all quotation requests' })
  @ApiResponse({
    status: 200,
    description: 'List of quotation requests retrieved successfully',
    type: [QuotationRequestEntity],
  })
  findAll() {
    return this.quotationRequestsService.findAll();
  }

  @Get('by-customer/:customerId')
  @ApiOperation({ summary: 'Get quotation requests by customer ID' })
  @ApiResponse({
    status: 200,
    description:
      'List of quotation requests for customer retrieved successfully',
    type: [QuotationRequestEntity],
  })
  findByCustomer(@Param('customerId') customerId: string) {
    return this.quotationRequestsService.findByCustomer(customerId);
  }

  @Get('by-workshop/:workshopId')
  @ApiOperation({ summary: 'Get quotation requests by workshop ID' })
  @ApiResponse({
    status: 200,
    description:
      'List of quotation requests for workshop retrieved successfully',
    type: [QuotationRequestEntity],
  })
  findByWorkshop(@Param('workshopId') workshopId: string) {
    return this.quotationRequestsService.findByWorkshop(workshopId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get quotation request by ID' })
  @ApiResponse({
    status: 200,
    description: 'Quotation request retrieved successfully',
    type: QuotationRequestEntity,
  })
  @ApiResponse({ status: 404, description: 'Quotation request not found' })
  findOne(@Param('id') id: string) {
    return this.quotationRequestsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update quotation request by ID' })
  @ApiResponse({
    status: 200,
    description: 'Quotation request updated successfully',
    type: QuotationRequestEntity,
  })
  @ApiResponse({ status: 404, description: 'Quotation request not found' })
  update(
    @Param('id') id: string,
    @Body() updateQuotationRequestDto: UpdateQuotationRequestDto,
  ) {
    return this.quotationRequestsService.update(id, updateQuotationRequestDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete quotation request by ID' })
  @ApiResponse({
    status: 200,
    description: 'Quotation request deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Quotation request not found' })
  remove(@Param('id') id: string) {
    return this.quotationRequestsService.remove(id);
  }
}
