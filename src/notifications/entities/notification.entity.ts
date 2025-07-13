import { ApiProperty } from '@nestjs/swagger';
import { Notification, NotificationType } from '@prisma/client';

export class NotificationEntity implements Notification {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  message: string;

  @ApiProperty({ enum: NotificationType })
  type: NotificationType;

  @ApiProperty()
  read: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  updatedBy: string;
}
