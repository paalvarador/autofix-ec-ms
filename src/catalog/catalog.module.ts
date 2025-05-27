import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { ModelController } from './model.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BrandService } from './brand.service';
import { ModelService } from './model.service';

@Module({
  imports: [PrismaModule],
  controllers: [BrandController, ModelController],
  providers: [BrandService, ModelService],
})
export class CatalogModule {}
