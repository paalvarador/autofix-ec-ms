import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationEntity } from './entities/notification.entity';

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiResponse({
    status: 201,
    description: 'Notification created successfully',
    type: NotificationEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notifications' })
  @ApiResponse({
    status: 200,
    description: 'List of notifications retrieved successfully',
    type: [NotificationEntity],
  })
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get('by-user/:userId')
  @ApiOperation({ summary: 'Get notifications by user ID' })
  @ApiResponse({
    status: 200,
    description: 'List of notifications for user retrieved successfully',
    type: [NotificationEntity],
  })
  findByUser(@Param('userId') userId: string) {
    return this.notificationsService.findByUser(userId);
  }

  @Get('unread/:userId')
  @ApiOperation({ summary: 'Get unread notifications by user ID' })
  @ApiResponse({
    status: 200,
    description: 'List of unread notifications for user retrieved successfully',
    type: [NotificationEntity],
  })
  findUnreadByUser(@Param('userId') userId: string) {
    return this.notificationsService.findUnreadByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get notification by ID' })
  @ApiResponse({
    status: 200,
    description: 'Notification retrieved successfully',
    type: NotificationEntity,
  })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update notification by ID' })
  @ApiResponse({
    status: 200,
    description: 'Notification updated successfully',
    type: NotificationEntity,
  })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationsService.update(id, updateNotificationDto);
  }

  @Patch(':id/mark-as-read')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({
    status: 200,
    description: 'Notification marked as read successfully',
    type: NotificationEntity,
  })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Patch('mark-all-read/:userId')
  @ApiOperation({ summary: 'Mark all notifications as read for a user' })
  @ApiResponse({
    status: 200,
    description: 'All notifications marked as read successfully',
  })
  markAllAsReadByUser(@Param('userId') userId: string) {
    return this.notificationsService.markAllAsReadByUser(userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete notification by ID' })
  @ApiResponse({
    status: 200,
    description: 'Notification deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(id);
  }
}
