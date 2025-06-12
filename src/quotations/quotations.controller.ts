import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import { QuotationService } from './quotations.service';

@Controller('quotations')
@ApiTags('quotations')
export class QuotationsController {
  constructor(private readonly quotationsService: QuotationService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create anew Quotation' })
  async create(@Body() CreateQuotationDto: CreateQuotationDto) {
    console.log(
      `Aqui vamos a crear una nueva cotizaciön con los siugientes datos: ${JSON.stringify(CreateQuotationDto)}`,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    console.log(`Controlador para obtener todas las cotizaciones`);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    console.log('Controlador para obtener una cotizacion en especifico');
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateQuotationDto: UpdateQuotationDto,
  ) {
    console.log('Controlador par aactualiar una cotizacion');
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    console.log('Controlador para eliminar una cotiación');
  }
}
