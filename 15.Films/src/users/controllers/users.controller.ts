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
            log('Error registering user: %O', error);
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
            log('Error logging in user: %O', error);
            if (error instanceof PrismaClientKnownRequestError) {
                const finalError = new HttpError(
                    401,
                    'Unauthorized',
                    'Invalid email or password',
                    {
                        cause: error,
                    },
                );
                return next(finalError);
            }
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
            log('Error getting all users: %O', error);
            internalError.cause = error;
            return next(internalError);
        }
    }

    async getUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            // Validated previously with zod middleware
            log('Get User: %O', id);
            const user: User = await this.#repo.getUserById(id);
            return res.json(user);
        } catch (error) {
            log('Error getting user by id: %O', error);
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
            log('Updating user with ID: %O', id);
            const userData: UserUpdateDTO = req.body;
            // Validated previously with zod middleware
            const user: User = await this.#repo.updateUser(id, userData);
            return res.json(user);
        } catch (error) {
            log('Error updating user: %O', error);
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                notFoundError.cause = error;
                return next(notFoundError);
            }

            internalError.cause = error;
            internalError.message = 'Failed to update user';
            return next(internalError);
        }
    }

    async updateProfileUser(req: Request, res: Response, next: NextFunction) {
        try {
            log('Updating user profile...');
            const id = Number(req.params.id);
            // Validate previously with zod middleware
            const profileData: Partial<ProfileDTO> = req.body; // Validate this data in a real application
            const user: User = await this.#repo.updateUserProfile(
                id,
                profileData,
            );
            return res.json(user);
        } catch (error) {
            log('Error updating user: %O', error);
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                notFoundError.cause = error;
                return next(notFoundError);
            }

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
            log('Error deleting user: %O', error);
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                notFoundError.cause = error;
                return next(notFoundError);
            }

            internalError.cause = error;
            internalError.message = 'Failed to delete user';
            return next(internalError);
        }
    }
}
