import { MailtrapClient } from 'mailtrap';
import { envService } from '../../config/env.js';

export const emailService = {
    async sendEmail(to: string, subject: string, message: string): Promise<void> {
        const { MAILTRAP_TOKEN } = envService.get();

        const client = new MailtrapClient({ token: MAILTRAP_TOKEN });

        await client.send({
            from: { name: 'BookShop', email: 'hello@demomailtrap.co' },
            to: [{ email: to }],
            subject,
            text: message,
        });
    },
};
