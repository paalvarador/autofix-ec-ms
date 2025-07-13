import { Module } from '@nestjs/common';
import { LaborsService } from './labors.service';
import { LaborsController } from './labors.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LaborsController],
  providers: [LaborsService],
})
export class LaborsModule {}
