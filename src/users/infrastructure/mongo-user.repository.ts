import { UserRepositoryPort } from '../../books/domain/user.repository.port.js';
import { UserModel } from '../user.model.js';

export class MongoUserRepository implements UserRepositoryPort {
    async findById(id: string) {
        return UserModel.findById(id);
    }
}
