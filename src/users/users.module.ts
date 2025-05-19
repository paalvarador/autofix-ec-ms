import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GrowthbookService } from 'src/growthbook/growthbook.service';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, GrowthbookService],
})
export class UsersModule {}
