import { MailtrapClient } from 'mailtrap';
import { EmailPort } from '../../books/domain/email.port.js';
import { envService } from '../../config/env.js';

let client: MailtrapClient | null = null;

const getClient = (): MailtrapClient => {
    if (!client) {
        const { MAILTRAP_TOKEN } = envService.get();
        client = new MailtrapClient({ token: MAILTRAP_TOKEN });
    }
    return client;
};

export class MailtrapEmailAdapter implements EmailPort {
    async sendEmail(to: string, subject: string, message: string): Promise<void> {
        await getClient().send({
            from: { name: 'BookShop', email: 'hello@demomailtrap.co' },
            to: [{ email: to }],
            subject,
            text: message,
        });
    }
}
