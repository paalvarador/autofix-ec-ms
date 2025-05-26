import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QuotationStatus } from '@prisma/client';
import { truncateSync } from 'fs';

@Injectable()
export class QuotationsService {
  constructor(private prisma: PrismaService) {}

  async create(createQuotationDto: CreateQuotationDto) {
    const { customerId, vehicleId, workshopId, total, estimatedTime, items } =
      createQuotationDto;

    const quotation = await this.prisma.quotation.create({
      data: {
        customerId,
        vehicleId,
        workshopId,
        total,
        estimatedTime,
        status: QuotationStatus.PENDING,
        items: {
          create: items.map((item) => ({
            ...item,
            price: item.price,
            partId: item.partId,
            laborTaskId: item.laborTaskId || null,
            description: item.description,
            type: item.type,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return quotation;
  }

  async findAll() {
    const quotations = await this.prisma.quotation.findMany({
      include: {
        items: true,
        customer: true,
        vehicle: {
          include: {
            brand: true,
            model: true,
          },
        },
        workshop: true,
      },
    });

    return quotations;
  }

  async findOne(id: string) {
    const quotation = await this.prisma.quotation.findUnique({
      where: { id },
      include: {
        items: true,
        customer: true,
        vehicle: {
          include: {
            brand: true,
            model: true,
          },
        },
        workshop: true,
      },
    });

    return quotation;
  
}
