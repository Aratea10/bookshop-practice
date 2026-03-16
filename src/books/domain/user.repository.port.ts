export interface UserRepositoryPort {
    findById(userId: string): Promise<{ id: string; email: string } | null>;
}
