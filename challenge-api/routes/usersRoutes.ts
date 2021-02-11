import {CommonRoutes} from './commonRoutes';
import UsersController from '../controllers/usersController'
import express, {Router} from 'express';
import {checkJwt} from "../controllers/middleware/checkJWT";

export class UsersRoutes extends CommonRoutes {

    constructor() {
        super('UsersRoutes', '/users');
    }

    configureRoutes() {
        const router = Router();

        router.get(`/`,  [checkJwt], UsersController.getAllUsers);

        router.post('/', [], UsersController.createServerUser);

        router.get(`/me`,  [checkJwt], UsersController.getUserInfo);

        router.get('/mail',[checkJwt], UsersController.findUserByMail);

        return router;
    }
}
