import {CommonRoutes} from './commonRoutes';
import AuthController from '../controllers/authController'
import express, {Router} from 'express';

export class AuthRoutes extends CommonRoutes {
    constructor() {
        super('UsersRoutes', '/auth');
    }

    configureRoutes() {
        const router = Router();

        router.post(`/login`,   AuthController.login);

        return router;
    }
}
