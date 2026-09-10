import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import fs from 'fs/promises';
import Handlebars from 'handlebars';
import path from 'path';

import logger from '../configs/logger.config';
import { BookingNotificationDto } from '../dtos/BookingNotification.dto';

const templatePath = path.resolve(__dirname, '../templates/email/html/BookingPending.hbs');
const sesClient = new SESClient({
    region: process.env.AWS_REGION || 'ap-south-1'
});

export async function sendBookingPendingNotification(data: BookingNotificationDto): Promise<void> {
    try {
        const template = await fs.readFile(templatePath, 'utf8');
        const html = Handlebars.compile(template)({
            candidateName: data.candidateName
        });

        const sourceEmail = process.env.SES_FROM_EMAIL;

        if(!sourceEmail) {
            throw new Error('SES_FROM_EMAIL is not configured; booking notifications cannot be sent');
        }

        await sesClient.send(new SendEmailCommand({
            Source: sourceEmail,
            Destination: {
                ToAddresses: [data.candidateEmail]
            },
            ReplyToAddresses: process.env.SES_REPLY_TO_EMAIL
                ? [process.env.SES_REPLY_TO_EMAIL]
                : undefined,
            ConfigurationSetName: process.env.SES_CONFIGURATION_SET_NAME,
            Message: {
                Subject: {
                    Data: 'Your InterviewCall booking is still pending',
                    Charset: 'UTF-8'
                },
                Body: {
                    Html: {
                        Data: html,
                        Charset: 'UTF-8'
                    }
                }
            }
        }));

        logger.info('Booking pending notification sent', {
            submissionId: data.submissionId,
            candidateEmail: data.candidateEmail
        });
    } catch (error) {
        logger.error('Booking pending notification failed', {
            submissionId: data.submissionId,
            candidateEmail: data.candidateEmail,
            error
        });

        throw error;
    }
}
