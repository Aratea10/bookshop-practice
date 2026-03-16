import { UserRepositoryPort } from '../../books/domain/user.repository.port.js';
import { UserModel } from '../user.model.js';

export class MongoUserRepository implements UserRepositoryPort {
    async findById(id: string) {
        return UserModel.findById(id);
    }

    async findByEmail(email: string) {
        return UserModel.findOne({ email });
    }

    async create(email: string, hashedPassword: string) {
        const user = new UserModel({ email, password: hashedPassword });
        return user.save();
    }
}
