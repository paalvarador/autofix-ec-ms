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
import { QuotationItemsService } from './quotation-items.service';
import { CreateQuotationItemDto } from './dto/create-quotation-item.dto';
import { UpdateQuotationItemDto } from './dto/update-quotation-item.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QuotationItemEntity } from './entities/quotation-item.entity';

@ApiTags('quotation-items')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('quotation-items')
export class QuotationItemsController {
  constructor(private readonly quotationItemsService: QuotationItemsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new quotation item' })
  @ApiResponse({
    status: 201,
    description: 'Quotation item created successfully',
    type: QuotationItemEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({
    status: 404,
    description: 'Quotation, part, or labor task not found',
  })
  create(@Body() createQuotationItemDto: CreateQuotationItemDto) {
    return this.quotationItemsService.create(createQuotationItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all quotation items' })
  @ApiResponse({
    status: 200,
    description: 'List of quotation items retrieved successfully',
    type: [QuotationItemEntity],
  })
  findAll() {
    return this.quotationItemsService.findAll();
  }

  @Get('by-quotation/:quotationId')
  @ApiOperation({ summary: 'Get quotation items by quotation ID' })
  @ApiResponse({
    status: 200,
    description: 'List of quotation items for quotation retrieved successfully',
    type: [QuotationItemEntity],
  })
  findByQuotation(@Param('quotationId') quotationId: string) {
    return this.quotationItemsService.findByQuotation(quotationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get quotation item by ID' })
  @ApiResponse({
    status: 200,
    description: 'Quotation item retrieved successfully',
    type: QuotationItemEntity,
  })
  @ApiResponse({ status: 404, description: 'Quotation item not found' })
  findOne(@Param('id') id: string) {
    return this.quotationItemsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update quotation item by ID' })
  @ApiResponse({
    status: 200,
    description: 'Quotation item updated successfully',
    type: QuotationItemEntity,
  })
  @ApiResponse({ status: 404, description: 'Quotation item not found' })
  update(
    @Param('id') id: string,
    @Body() updateQuotationItemDto: UpdateQuotationItemDto,
  ) {
    return this.quotationItemsService.update(id, updateQuotationItemDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete quotation item by ID' })
  @ApiResponse({
    status: 200,
    description: 'Quotation item deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Quotation item not found' })
  remove(@Param('id') id: string) {
    return this.quotationItemsService.remove(id);
  }
}
