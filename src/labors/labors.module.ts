import { Module } from '@nestjs/common';
import { LaborsService } from './labors.service';
import { LaborsController } from './labors.controller';

@Module({
  controllers: [LaborsController],
  providers: [LaborsService],
})
export class LaborsModule {}
