import { Module } from '@nestjs/common';
import { NotificationService } from './V1/notification.service';
import { NotificationController } from './V1/notification.controller';

@Module({
    providers: [NotificationService],
    controllers: [NotificationController],
})
export class NotificationModule {}