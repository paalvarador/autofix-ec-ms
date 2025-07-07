import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CatalogModule } from './catalog/catalog.module';
import { QuotationsModule } from './quotations/quotations.module';
import { GrowthbookService } from './growthbook/growthbook.service';
import { VehiclesModule } from './vehicles/vehicles.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    PrismaModule,
    AuthModule,
    QuotationsModule,
    CatalogModule,
    VehiclesModule,
  ],
  controllers: [],
  providers: [GrowthbookService],
})
export class AppModule {}
