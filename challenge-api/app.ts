
import express, {Router} from 'express';
import * as http from 'http';
import * as bodyparser from 'body-parser';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors'
import {CommonRoutes} from './routes/commonRoutes';
import {UsersRoutes} from './routes/usersRoutes';
import debug from 'debug';
import mongoose from "mongoose";
import {AuthRoutes} from "./routes/authRoutes";

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port: Number = 3001;
const router = Router();
const routes: Array<CommonRoutes> = [];
const debugLog: debug.IDebugger = debug('app');
const  mongoUrl: string = 'mongodb://localhost/drixit';
app.use(bodyparser.json());
app.use(cors());

app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
}));

routes.push(new UsersRoutes());
routes.push(new AuthRoutes());

app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
}));

/* MongoDB config */
//TODO ADD NO CONNECTION ERROR
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })

/* Routes config */
routes.forEach((route: CommonRoutes) => {
    debugLog(`Routes configured for ${route.getName()}`);
    router.use(route.getPath(), route.configureRoutes());
});

app.use('/', router);

app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send(`Server running at http://localhost:${port}`)
});

server.listen(port, () => {
    debugLog(`Server running at http://localhost:${port}`);
});
