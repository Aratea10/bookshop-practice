import { UserModel } from './user.model.js';

export const userRepository = {
    async create(email: string, hashedPassword: string) {
        const user = new UserModel({ email, password: hashedPassword });
        return user.save();
    },

    async findByEmail(email: string) {
        return UserModel.findOne({ email });
    },

    async findById(userId: string) {
        return UserModel.findById(userId);
    },
};
