import { env } from '../../config/env.ts';
import debug from 'debug';
import type { UsersRepo } from '../repos/users.repo.ts';
import type { NextFunction, Request, Response } from 'express';
import type {
    LoginUserData,
    ProfileDTO,
    RegisterUserData,
    User,
    UserUpdateDTO,
} from '../../zod/user.schemas.ts';
import { HttpError } from '../../errors/http-error.ts';
import type { LoginResult } from '../../types/login.ts';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

const log = debug(`${env.PROJECT_NAME}:controller:users`);
log('Loading users controller...');

const internalError = new HttpError(
    500,
    'Internal Server Error',
    'An unexpected error occurred while processing the request',
);

const notFoundError = new HttpError(
    404,
    'Not Found',
    'The requested user was not found',
);

const unauthorizedError = new HttpError(
    401,
    'Unauthorized',
    'Invalid email or password',
);

export class UsersController {
    #repo: UsersRepo;
    constructor(repo: UsersRepo) {
        this.#repo = repo;
    }

    async register(req: Request, res: Response, next: NextFunction) {
        try {
            log('Registering new user...');
            const userData: RegisterUserData = req.body;
            // Validated previously with zod middleware
            const user: User = await this.#repo.register(userData);
            return res.status(201).json(user);
        } catch (error) {
            log('Error registering user: %s', internalError.message);
            internalError.cause = error;
            internalError.message = 'Failed to register user';
            return next(internalError);
        }
    }
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            log('Logging in user...');
            const loginData: LoginUserData = req.body;
            // Validated previously with zod middleware
            const loginResult: LoginResult = await this.#repo.login(loginData);
            return res.json(loginResult);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                log('Error logging in user: %s', unauthorizedError.message);
                unauthorizedError.cause = error;
                return next(unauthorizedError);
            }
            log('Error logging in user: %s', internalError.message);
            internalError.cause = error;
            internalError.message = 'Failed to login user';
            return next(internalError);
        }
    }

    async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            log('Getting all users...');
            const users: User[] = await this.#repo.getAllUsers();
            return res.json(users);
        } catch (error) {
            internalError.cause = error;
            log('Error getting all users: %s', internalError.message);
            return next(internalError);
        }
    }

    async getUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            // Validated previously with zod middleware
            log('Get User %s', id);
            const user: User = await this.#repo.getUserById(id);
            return res.json(user);
        } catch (error) {
            log('Error getting user by id: %s', internalError.message);
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                notFoundError.cause = error;
                return next(notFoundError);
            }

            internalError.cause = error;
            return next(internalError);
        }
    }

    async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            // Validated previously with zod middleware
            log('Updating user with ID: %s', id);
            const userData: UserUpdateDTO = req.body;
            // Validated previously with zod middleware
            const user: User = await this.#repo.updateUser(id, userData);
            return res.json(user);
        } catch (error) {
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                log('Error updating user: %s', notFoundError.message);
                notFoundError.cause = error;
                return next(notFoundError);
            }

            log('Error updating user: %s', internalError.message);
            internalError.cause = error;
            internalError.message = 'Failed to update user';
            return next(internalError);
        }
    }

    async updateProfileUser(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            log('Updating user profile %s', id);
            // Validate previously with zod middleware
            const profileData: Partial<ProfileDTO> = req.body; // Validate this data in a real application
            const user: User = await this.#repo.updateUserProfile(
                id,
                profileData,
            );
            return res.json(user);
        } catch (error) {
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                log('Error updating user profile: %s', notFoundError.message);
                notFoundError.cause = error;
                return next(notFoundError);
            }

            log('Error updating user profile: %s', internalError.message);
            internalError.cause = error;
            internalError.message = 'Failed to update profile user';
            return next(internalError);
        }
    }

    async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            // Validated previously with zod middleware
            log('Deleting user with ID: %O', id);
            await this.#repo.deleteUser(id);
            return res.status(204).end();
        } catch (error) {
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                log('Error deleting user: %s', notFoundError.message);
                notFoundError.cause = error;
                return next(notFoundError);
            }

            log('Error deleting user: %s', internalError.message);
            internalError.cause = error;
            internalError.message = 'Failed to delete user';
            return next(internalError);
        }
    }
}
