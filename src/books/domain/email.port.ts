export interface EmailPort {
    sendEmail(to: string, subject: string, message: string): Promise<void>;
}
