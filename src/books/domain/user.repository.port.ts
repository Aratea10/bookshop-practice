export interface UserRepositoryPort {
    findById(userId: string): Promise<{ id: string; email: string } | null>;
    findByEmail(email: string): Promise<any>;
    create(email: string, hashedPassword: string): Promise<any>;
}
