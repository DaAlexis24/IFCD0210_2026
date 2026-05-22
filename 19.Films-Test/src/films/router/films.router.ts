import type { FilmsController } from '../controllers/films.controller.ts';
import { Router } from 'express';
import debug from 'debug';
import { env } from '../../config/env.ts';
import { validateBody, validateParams } from '../../middleware/validations.ts';
import {
    FilmCreateDTOSchema,
    FilmUpdateDTOSchema,
} from '../entities/film.dto.ts';
import { AuthInterceptor } from '../../middleware/auth.interceptor.ts';

const log = debug(`${env.PROJECT_NAME}:router:films`);
log('Loading films router...');

export class FilmsRouter {
    #controller: FilmsController;
    #router: Router;
    #authInterceptor: AuthInterceptor;
    constructor(controller: FilmsController, authInterceptor: AuthInterceptor) {
        log('Initializing films router...');
        this.#controller = controller;
        this.#router = Router();
        this.#authInterceptor = authInterceptor;

        /**
         * @openapi
         * tags:
         *  - name: Films
         *    description: API endpoints for managing films
         */

        /**
         * @openapi
         * components:
         *   securitySchemes:
         *     bearerAuth:
         *       type: http
         *       scheme: bearer
         *       bearerFormat: JWT
         *       description: Send `Authorization: Bearer <token>`.
         */

        /**
         * @openapi
         *
         * /api/films:
         *   get:
         *     summary: Retrieve a list of films
         *     tags: [Films]
         *     responses:
         *       200:
         *         description: A list of films
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 $ref: '#/components/schemas/Film'
         */
        this.#router.get(
            '/',
            this.#controller.getAllFilms.bind(this.#controller),
        );

        /**
         * @openapi
         *
         * /api/films/{id}:
         *   get:
         *     summary: Retrieve a single film by ID
         *     tags: [Films]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: integer
         *           format: int32
         *     responses:
         *       200:
         *         description: A single film
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Film'
         *       404:
         *         description: Film not found
         *       500:
         *         description: Server error
         *
         */
        this.#router.get(
            '/:id',
            validateParams(),
            this.#controller.getFilmById.bind(this.#controller),
        );
        /**
         * @openapi
         *
         * /api/films:
         *   post:
         *     summary: Create a new film
         *     tags: [Films]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/FilmCreateDTO'
         *     responses:
         *       201:
         *         description: Film created successfully
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Film'
         *       400:
         *         description: Invalid input data
         *       401:
         *         description: Missing or invalid token
         *       403:
         *         description: Forbidden (requires EDITOR role)
         *       500:
         *         description: Server error
         *     security:
         *       - bearerAuth: []
         */
        this.#router.post(
            '/',
            validateBody(FilmCreateDTOSchema),
            this.#authInterceptor.authenticate.bind(this.#authInterceptor),
            this.#authInterceptor
                .authorize(['EDITOR'])
                .bind(this.#authInterceptor),
            this.#controller.createFilm.bind(this.#controller),
        );

        /**
         * @openapi
         *
         * /api/films/{id}:
         *   patch:
         *     summary: Update a film (partial)
         *     tags: [Films]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: integer
         *           format: int32
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/FilmUpdateDTO'
         *     responses:
         *       200:
         *         description: Film updated successfully
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Film'
         *       400:
         *         description: Invalid input data
         *       401:
         *         description: Missing or invalid token
         *       403:
         *         description: Forbidden (requires EDITOR role)
         *       404:
         *         description: Film not found
         *       500:
         *         description: Server error
         *     security:
         *       - bearerAuth: []
         */
        this.#router.patch(
            '/:id',
            validateParams(),
            validateBody(FilmUpdateDTOSchema),
            this.#authInterceptor.authenticate.bind(this.#authInterceptor),
            this.#authInterceptor
                .authorize(['EDITOR'])
                .bind(this.#authInterceptor),
            this.#controller.updateFilm.bind(this.#controller),
        );

        /**
         * @openapi
         *
         * /api/films/{id}:
         *   delete:
         *     summary: Delete a film
         *     tags: [Films]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: integer
         *           format: int32
         *     responses:
         *       204:
         *         description: Film deleted successfully
         *       401:
         *         description: Missing or invalid token
         *       403:
         *         description: Forbidden (requires EDITOR role)
         *       404:
         *         description: Film not found
         *       500:
         *         description: Server error
         *     security:
         *       - bearerAuth: []
         */
        this.#router.delete(
            '/:id',
            validateParams(),
            this.#authInterceptor.authenticate.bind(this.#authInterceptor),
            //this.#authInterceptor.isOwnerOrAdmin.bind(this.#authInterceptor),
            this.#authInterceptor
                .authorize(['EDITOR'])
                .bind(this.#authInterceptor),
            this.#controller.deleteFilm.bind(this.#controller),
        );
    }

    get router() {
        return this.#router;
    }
}
