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
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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
  @ApiCreatedResponse({
    description: 'Quotation successfully created',
    schema: {
      example: {
        statusCode: 200,
        message: 'Quotation created successfully',
        quotation: {
          id: '1d95a1ba-fa4a-4e79-926b-df28cb571d6e',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Bad request - Missing or invalid fields',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid Quotation 5',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - Unexpected server error',
    schema: {
      example: {
        statusCode: 500,
        message: 'Something went wrong, please try again later',
      },
    },
  })
  async create(@Body() createQuotationDto: CreateQuotationDto) {
    const quotation = await this.quotationsService.create(createQuotationDto);

    return {
      message: 'Quotation created successfully',
      quotation,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Find a list of quotations ' })
  @ApiCreatedResponse({
    description: 'Quotations found successfully',
    schema: {
      example: {
        message: 'Quotations found successfully',
        quotation: [
          {
            id: '1d95a1ba-fa4a-4e79-926b-df28cb571d6e',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - Unexpected server error',
    schema: {
      example: {
        statusCode: 500,
        messsage: 'Something went wrong, please try again later',
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return await this.quotationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a quotation by id' })
  @ApiCreatedResponse({
    description: 'Quotation found successfully',
    schema: {
      example: {
        message: 'Quotation found successfully',
        quotation: {
          id: '1d95a1ba-fa4a-4e79-926b-df28cb571d6e',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Quotation not found',
    schema: {
      example: {
        statusCode: 404,
        message:
          'Quotation with ID 1d95a1ba-fa4a-4e79-926b-df28cb571d6e not found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - Unexpected server error',
    schema: {
      example: {
        statusCode: 500,
        message: 'Something went wrong, please try again later',
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.quotationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a quotation by Id' })
  @ApiCreatedResponse({
    description: 'Quotation updated successfully',
    schema: {
      example: {
        message: 'Quotation updated successfully',
        user: {
          id: '1d95a1ba-fa4a-4e79-926b-df28cb571d6e',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Quotation not found',
    schema: {
      example: {
        statusCode: 404,
        message:
          'Quotation with ID 1d95a1ba-fa4a-4e79-926b-df28cb571d6e not found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - Unexpected server error',
    schema: {
      example: {
        statusCode: 500,
        message: 'Something wen wrong, please try again later',
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateQuotationDto: UpdateQuotationDto,
  ) {
    return this.quotationsService.update(id, updateQuotationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a quotation by Id ' })
  @ApiCreatedResponse({
    description: 'Quotation deleted successfully',
    schema: {
      example: {
        message: 'Quotation deleted successfully',
        quotation: {
          id: '1d95a1ba-fa4a-4e79-926b-df28cb571d6e',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Quotation not found',
    schema: {
      example: {
        statusCode: 404,
        message: `Quotation with ID 1d95a1ba-fa4a-4e79-926b-df28cb571d6e not found`,
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - Unexpected server error',
    schema: {
      example: {
        statusCode: 500,
        message: 'Something went wrong, please try again later',
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return this.quotationsService.remove(id);
  }
}
