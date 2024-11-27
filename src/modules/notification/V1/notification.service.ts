import { Injectable } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';
import { messaging } from 'src/config/firebase-admin';

@Injectable()
export class NotificationService {
  // Method to send a notification to a specific device using a token
  async sendNotification(token: string, text: {title: string, message: string}) {
   // Construct the payload for the notification
    const payload = {
      notification: {
        title: text.title,
        body: text.message,
      },
    };

    // Send the notification using Firebase Admin SDK
    try {
      const response = await messaging.send({
        token,
        notification: payload.notification,
      });
      console.log('Notifications sent successfully:', response);
    } catch (error) {
      console.error('Error sending notifications:', error);
      throw new InternalServerErrorException('Failed to send notifications');
    }
  }
}
