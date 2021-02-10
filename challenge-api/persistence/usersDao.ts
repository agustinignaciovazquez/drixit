import { ClientUser, ServerUser } from '../models/user';
import User from './schemas/user';

class UsersDao {
    private static instance: UsersDao;
    static getInstance(): UsersDao {
        if (!UsersDao.instance) {
            UsersDao.instance = new UsersDao();
        }
        return UsersDao.instance;
    }

    public async createClientUser(user_params: ClientUser) {
        const _session = new User(user_params);
        return _session.save();
    }

    public createServerUser(user_params: ServerUser) {
        const _session = new User(user_params);
        return _session.save();
    }

    public async findUser(query: any) {
        return User.findOne(query).exec();
    }

    public async listAllUsers(){
        return User.find({}).exec();
    }

    public async deleteUser(_id: String) {
        const query = { _id: _id };
        return User.deleteOne(query).exec();
    }

}
export default UsersDao.getInstance();
