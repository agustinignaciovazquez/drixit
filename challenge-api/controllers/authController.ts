import {NextFunction, Request, Response} from "express";
import UsersService from "../services/usersService";
import config from "../config";
import * as jwt from "jsonwebtoken";
import {IUser} from "../persistence/schemas/user";

class AuthController {
    private static instance: AuthController;
    static getInstance(): AuthController {
        if (!AuthController.instance) {
            AuthController.instance = new AuthController();
        }
        return AuthController.instance;
    }
    async login(req: Request, res: Response){
        //Check parameters
        let { email, password } = req.body;
        if (!(email && password)) {
            res.status(422).json({message: 'Invalid parameters'});
        }

        let user: IUser | null;
        try {
            user = await UsersService.findUserByMail(email);
            //Check if encrypted password match
            if (user === null || user.password !== password) {
                res.status(401).json({'message': 'Unauthorized'});
                return;
            }

            //Sing JWT, valid for 24 days
            const token = jwt.sign({ userId: user.id, email: user.email },
                config.jwtSecret, { expiresIn: "24d" });

            //Send the jwt in the response
            res.status(200).json({'jwt-token': token});
        } catch (error) {
            res.status(500).json({message: 'Server side error'});
        }
    }
}

export default AuthController.getInstance();

