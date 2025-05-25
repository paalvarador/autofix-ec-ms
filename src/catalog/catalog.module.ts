import { Module } from '@nestjs/common';
import { VehicleBrandController } from './vehicle-brand.controller';
import { VehicleModelController } from './vehicle-model.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { VehicleBrandService } from './vehicle-brand.service';
import { VehicleModelService } from './vehicle-model.service';

@Module({
  imports: [PrismaModule],
  controllers: [VehicleBrandController, VehicleModelController],
  providers: [VehicleBrandService, VehicleModelService],
})
export class CatalogModule {}
