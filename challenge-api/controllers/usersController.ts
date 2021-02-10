import {Request, Response} from "express";
import {ClientUser, ServerUser} from "../models/user";
import {UserDTO} from "./dto/userDTO";
import UsersService from "../services/usersService";
import {IUser} from "../persistence/schemas/user";

class UsersController {
    private static instance: UsersController;

    static getInstance(): UsersController {
        if (!UsersController.instance) {
            UsersController.instance = new UsersController();
        }
        return UsersController.instance;
    }

    async createServerUser(req: Request, res: Response){
        const serverUser: ServerUser | undefined = UsersController.parseServerUserFromRequest(req);
        if(serverUser === undefined)
            res.status(422).json({message: 'Invalid parameters'});
        else
            UsersService.createServerUser(serverUser)
                .then((user) => {
                    const userDTO = UsersController.getUserDTO(user);
                    res.status(200).json({message: userDTO});
                })
                .catch(()=>{
                    res.status(500).json({message: 'Server Side Error'});
                });
    }

    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await UsersService.listAllUsers();
            const usersDTO = users.map((value => UsersController.getUserDTO(value)))
            res.status(200).send(usersDTO);
        } catch (e) {
            res.status(500).json({message: 'Server Side Error'});
        }
    }

    async getUserInfo(req: Request, res: Response){
        const jwtPayload = res.locals.jwtPayload;
        const email = jwtPayload.email;
        try {
            let user = await UsersService.findUserByMail(email);
            if (!user)
                res.status(404).json({message: 'User not found'});
            else {
                res.status(200).send(UsersController.getUserDTO(user));
            }
        }catch(err){
            res.status(500).json({message: 'Server side error'});
        }
    }

    async findUserByMail(req: Request, res: Response) {
        if (!req.query.email) {
            res.status(422).json({message: 'Invalid parameters'})
        } else {
            try {
                const email = <string>req.query.email;
                let user = await UsersService.findUserByMail(email);
                if (!user)
                    res.status(404).json({message: 'User not found'});
                else {
                    const userDTO = UsersController.getUserDTO(user);
                    res.status(200).send(userDTO);
                }
            } catch (e) {
                res.status(500).json({message: 'Server Side Error'});
            }
        }
    }

    private static getUserDTO(user: IUser): UserDTO{
        return {id: user.id,
            avatar: user.avatar,
            age: user.age,
            email: user.email,
            name: user.name,
            role: user.role,
            surname: user.surname};
    }

    private static parseServerUserFromRequest(req: Request): ServerUser | undefined{
        if (!(req.body.id && req.body.avatar && req.body.age && req.body.email &&
            req.body.name && req.body.role && req.body.surname && req.body.password))
            return undefined;

        return {
            id: req.body.id,
            avatar: req.body.avatar,
            age: req.body.age,
            email: req.body.email,
            name: req.body.name,
            role: req.body.role,
            surname: req.body.surname,
            password: req.body.password
        };
    }
}
export default UsersController.getInstance();

