import { UserModel } from '../../DB/model/index.js'

export const profile = async (id) => {
    try {
        const user = await UserModel.findById(id);
        return user;
    } catch (error) {
        return null;
    }
}