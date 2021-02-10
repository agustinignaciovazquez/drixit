import {NextFunction, Request, Response} from "express";
import * as jwt from "jsonwebtoken";
import config from "../../config";

export const checkJwt = async(req: Request, res: Response, next: NextFunction) => {
    //Get the jwt token from the head
    const token = <string>req.headers["auth"];
    let jwtPayload;

    //Try to validate the token and get data
    try {
        jwtPayload = <any>jwt.verify(token, config.jwtSecret);
        res.locals.jwtPayload = jwtPayload;
    } catch (error) {
        //If token is not valid, respond with 401 (unauthorized)
        res.status(401).json({'message': 'Unauthorized'});
        return;
    }

    //Call the next middleware or controller
    next();
};
