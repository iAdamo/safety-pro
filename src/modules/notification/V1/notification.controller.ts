import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from './notification.service'; 

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('notification')
  async sendNotification(
    @Body('token') token: string,
    @Body('title') title: string,
    @Body('message') message: string,
  ) {
    // Create a sample text object (this seems to be a placeholder and might need to be replaced with actual data)
    const text = { title, message };
    try {
      await this.notificationService.sendNotification(token, text);
      return { success: true, message: 'Notification sent successfully' };
    } catch (error) {
      return { success: false, message: 'Error sending notification', error };
    }
  }
}