import { ClientUser, ServerUser } from '../models/user';
import UsersDao from '../persistence/usersDao'

class UsersService {
    private static instance: UsersService;
    static getInstance(): UsersService {
        if (!UsersService.instance) {
            UsersService.instance = new UsersService();
        }
        return UsersService.instance;
    }

    public async createClientUser(user_params: ClientUser) {
        return UsersDao.createClientUser(user_params);
    }

    public async createServerUser(user_params: ServerUser) {
        return UsersDao.createServerUser(user_params);
    }

    public async listAllUsers(){
        return UsersDao.listAllUsers();
    }

    public async findUserByMail(mail: String) {
        return UsersDao.findUser({email: mail});
    }

    public async deleteUser(_id: String) {
        return UsersDao.deleteUser(_id);
    }

}
export default UsersService.getInstance();
