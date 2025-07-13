import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CatalogModule } from './catalog/catalog.module';
import { QuotationsModule } from './quotations/quotations.module';
import { GrowthbookService } from './growthbook/growthbook.service';
import { VehiclesModule } from './vehicles/vehicles.module';
import { PartsModule } from './parts/parts.module';
import { LaborsModule } from './labors/labors.module';
import { WorkshopsModule } from './workshops/workshops.module';
import { QuotationRequestsModule } from './quotation-requests/quotation-requests.module';
import { WorkOrdersModule } from './work-orders/work-orders.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { QuotationItemsModule } from './quotation-items/quotation-items.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    PrismaModule,
    AuthModule,
    QuotationsModule,
    CatalogModule,
    VehiclesModule,
    PartsModule,
    LaborsModule,
    WorkshopsModule,
    QuotationRequestsModule,
    WorkOrdersModule,
    AppointmentsModule,
    NotificationsModule,
    QuotationItemsModule,
  ],
  controllers: [],
  providers: [GrowthbookService],
})
export class AppModule {}
