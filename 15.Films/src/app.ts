import { env } from './config/env.ts';
import debug from 'debug';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { customHeaders } from './middleware/customs.ts';
import { HttpError } from './errors/http-error.ts';
import { errorHandler } from './middleware/error-handler.ts';
import { HomeView } from './views/home.ts';
import type { AppPrismaClient } from './config/db-config.ts';
import { UsersRepo } from './users/repos/users.repo.ts';
import { UsersController } from './users/controllers/users.controller.ts';
import { UsersRouter } from './users/router/users.routes.ts';
import type { TokenPayload } from './types/login.ts';
import { AuthInterceptor } from './middleware/auth.interceptor.ts';
import { FilmsRepo } from './films/repos/films.repo.ts';
import { FilmsController } from './films/controllers/films.controller.ts';
import { FilmsRouter } from './films/router/films.router.ts';

declare module 'express' {
    interface Request {
        user?: TokenPayload;
    }
}

export const createApp = (prisma: AppPrismaClient) => {
    const log = debug(`${env.PROJECT_NAME}:app`);
    log('Starting Express app...');
    const app = express();
    app.disable('x-powered-by');
    // Middleware Utilities
    app.use(morgan('dev'));
    app.use(
        cors({
            origin: '*',
        }),
    );
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(customHeaders(env.PROJECT_NAME));

    app.use(express.static('public'));

    app.use('/health', (_req, res) => {
        return res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
        });
    });

    app.get('/', async (_req, res) => {
        log('Received request to root endpoint');
        return res.send(HomeView.render());
    });

    app.get('/api', (_req, res) => {
        log('Received request to root endpoint');
        return res.send(HomeView.render());
    });

    const authInterceptor = new AuthInterceptor();

    const usersRepo = new UsersRepo(prisma);
    const usersController = new UsersController(usersRepo);
    const usersRouter = new UsersRouter(usersController, authInterceptor);
    app.use('/api/users', usersRouter.router);

    const filmsRepo = new FilmsRepo(prisma);
    const filmsController = new FilmsController(filmsRepo);
    const filmsRouter = new FilmsRouter(filmsController, authInterceptor);
    app.use('/api/films', filmsRouter.router);      

    app.use((_req, _res, next) => {
        log('Calling errorHandler for 404 error');
        const error = new HttpError(404, 'Not Found', 'Resource not found');
        next(error);
    });

    app.use(errorHandler);

    return app;
};
