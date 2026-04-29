import { env } from '../../config/env.ts';
import debug from 'debug';
import type { FilmsRepo } from '../repos/films.repo.ts';
import type { Request, Response, NextFunction } from 'express';
import { HttpError } from '../../errors/http-error.ts';
import type { Film, FilmUpdateDTO } from '../../zod/film.schemas.ts';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

const log = debug(`${env.PROJECT_NAME}:controller:films`);
log('Loading films controller...');

const internalError = new HttpError(
    500,
    'Internal Server Error',
    'An unexpected error occurred while processing the request',
);

const notFoundError = new HttpError(
    404,
    'Not Found',
    'The requested film was not found',
);

export class FilmsController {
    #repo: FilmsRepo;
    constructor(repo: FilmsRepo) {
        this.#repo = repo;
    }

    async getAllFilms(req: Request, res: Response, next: NextFunction) {
        try {
            log('Getting all films...');
            const films: Film[] = await this.#repo.getAllFilms();
            return res.json(films);
        } catch (error) {
            log('Error getting all films: %O', error);
            internalError.cause = error;
            return next(internalError);
        }
    }

    async getFilmById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            // Validated previously with zod middleware
            log('Get Film: %O', id);
            const film: Film = await this.#repo.getFilmByID(id);
            return res.json(film);
        } catch (error) {
            log('Error getting film by id: %O', error);
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

    async createFilm(req: Request, res: Response, next: NextFunction) {
        try {
            const filmData = req.body;
            log('Creating film: %O', filmData);
            const newFilm: Film = await this.#repo.createFilm(filmData);
            return res.status(201).json(newFilm);
        } catch (error) {
            log('Error creating film: %O', error);
            internalError.cause = error;
            return next(internalError);
        }
    }

    async updateFilm(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            log('Updating film with ID: %O', id);
            const filmData: FilmUpdateDTO = req.body;
            const film: Film = await this.#repo.updateFilm(id, filmData);
            return res.json(film);
        } catch (error) {
            log('Error updating film: %O', error);
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                notFoundError.cause = error;
                return next(notFoundError);
            }
            internalError.cause = error;
            internalError.message = 'Failed to update film';
            return next(internalError);
        }
    }

    async deleteFilm(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            log('Deleting film with ID: %O', id);
            await this.#repo.deleteFilm(id);
            return res.status(204).send();
        } catch (error) {
            log('Error deleting film: %O', error);
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                notFoundError.cause = error;
                return next(notFoundError);
            }
            internalError.cause = error;
            internalError.message = 'Failed to delete film';
            return next(internalError);
        }
    }
}
